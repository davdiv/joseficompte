/*
 * Copyright (C) 2016 DivDE <divde@laposte.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

import url from "url";
import http from "http";
import https from "https";
import fs from "fs";
import minimist from "minimist";
import mongodb from "mongodb";
import Application from "./application";
import initDatabase from "./initDatabase";
import promisify from "pify";
import appInfo from "@client/appInfo";
import nodemailer from "nodemailer";
import consoleNodeMailer from "./consoleNodeMailer";
import os from "os";
import pkg from "../../package.json"; // the path to package.json is relative to the build output

const readFile = promisify(fs.readFile);
const usageInfo = `
Usage: ${pkg.name} [options]

Available options:
\t--database <db-url>                  Database to connect to.
\t--erase-database                     Erases the database when starting. Use with caution.
\t--init-database                      Initialises the database when starting.
\t--init-database-from <folder>        Specifies a folder containing a database to import.
\t--mail-transport <transport-url>     SMTP server to connect to, to send e-mails.
\t                                      For example: smtp://localhost
\t--mail-sender <sender>               Sender address when sending e-mails.
\t                                      For example: '"${appInfo.title}" <no-reply@myapplication.com>'
\t--address <address>                  Full public address of the web server.
\t                                      For example: https://myapplication.com
\t--host <host>                        Host of the web server.
\t                                      For example: localhost
\t--port <port>                        Port of the web server.
\t--pfx <pfx>                          Enables TLS with the given key file.
\t--trust-proxy                        Trusts the X-Forwarded-For header.
\t--help                               Prints this help message and exits.
\t--version                            Prints the version number and exits.
`;

const licenseNotice = `${pkg.name}: ${pkg.description}
Copyright (C) 2016 DivDE <divde@laposte.net>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
`;

const capitalize = (str) => str.replace(/[^a-z0-9]/ig, "_").toUpperCase();

export default async function (argv) {
    const defaultParams = {};
    const booleanParams = ["help", "version"];
    const appPrefix = capitalize(pkg.name);
    const setParamDefault = (paramName, defValue, boolean) => {
        const capitalizedParamName = capitalize(paramName);
        let value = process.env[`${capitalizedParamName}`] || process.env[`${appPrefix}_${capitalizedParamName}`] || defValue;
        if (boolean) {
            value = (value === "true");
            booleanParams.push(paramName);
        }
        defaultParams[paramName] = value;
    };
    setParamDefault("database", "mongodb://localhost/default");
    setParamDefault("erase-database", "false", true);
    setParamDefault("init-database", "false", true);
    setParamDefault("init-database-from");
    setParamDefault("mail-transport", "smtp://localhost");
    setParamDefault("mail-sender");
    setParamDefault("address");
    setParamDefault("host");
    setParamDefault("port", "8080");
    setParamDefault("pfx");
    setParamDefault("trust-proxy", "false", true);

    argv = minimist(argv, {
        "boolean": booleanParams,
        "default": defaultParams
    });

    if (argv.help) {
        console.log(usageInfo);
        return;
    }

    if (argv.version) {
        console.log(pkg.version);
        return;
    }

    if (!argv.address) {
        argv.address = url.format({
            protocol: argv.pfx ? "https" : "http",
            hostname: argv.host || os.hostname(),
            port: argv.port
        });
    }

    if (!argv["mail-sender"]) {
        const hostname = url.parse(argv.address).hostname;
        argv["mail-sender"] = `"${appInfo.title} (on ${hostname})" <no-reply@${hostname}>`;
    }

    console.log(licenseNotice);
    console.log("Parameters:");
    console.log(`NODE_ENV: ${JSON.stringify(process.env.NODE_ENV)}`);
    Object.keys(defaultParams).forEach((key) => console.log(`${key}: ${JSON.stringify(argv[key])}`));
    console.log("");
    console.log("Versions:");
    console.log(`${pkg.name}: ${pkg.version}`);
    Object.keys(process.versions).forEach((key) => console.log(`${key}: ${process.versions[key]}`));
    console.log("");

    let pfx;
    if (argv.pfx) {
        pfx = await readFile(argv.pfx);
    }
    const port = parseInt(argv.port, 10);
    const databaseURI = argv.database;

    console.log("Connecting to the database at %s ...", databaseURI);
    const database = await mongodb.MongoClient.connect(databaseURI);
    console.log("Successfully connected to %s.\n", databaseURI);

    if (argv["erase-database"]) {
        console.log("Erasing the database ...");
        await database.dropDatabase();
        console.log("Successfully erased the database.\n");
    }

    if (argv["init-database"]) {
        const allCollections = await database.listCollections().toArray();
        const filteredCollections = allCollections.filter(({name}) => !name.startsWith("system."));
        if (filteredCollections.length > 0) {
            throw new Error(`The database is not empty (it contains ${filteredCollections.length} collection(s)).`);
        }
        console.log("Initializing the database ...");
        await initDatabase(database, argv["init-database-from"]);
        console.log("Successfully initialized the database.\n");
    }

    const expectedDatabaseHeader = pkg.databaseHeader;
    const actualDatabaseHeader = await database.collection("general").find().limit(1).next();
    if (!actualDatabaseHeader || actualDatabaseHeader.application !== expectedDatabaseHeader.application || actualDatabaseHeader.dbVersion !== expectedDatabaseHeader.dbVersion) {
        throw new Error(`The database is either not initialized, or containing data for a different application or a different version of the application: ${JSON.stringify(actualDatabaseHeader)}`);
    }

    const httpServer = pfx ? https.createServer({
        pfx: pfx
    }) : http.createServer();

    const mailTransport = nodemailer.createTransport(argv["mail-transport"] === "console" ? consoleNodeMailer : argv["mail-transport"]);

    const application = new Application();
    await application.init({
        database,
        address: argv.address,
        mailTransport: mailTransport,
        mailSender: argv["mail-sender"],
        trustProxy: argv["trust-proxy"]
    });
    application.attachTo(httpServer);
    httpServer.listen(port, argv.host);
    httpServer.on("listening", function() {
        const address = httpServer.address();
        console.log("Listening on %s\n", url.format({
            protocol: pfx ? "https" : "http",
            hostname: address.address,
            port: address.port
        }));
    });
};
