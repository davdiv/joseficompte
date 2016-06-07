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

import {ObjectId} from "mongodb";
import path from "path";
import fs from "fs";
import promisify from "pify";
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const reviver = (key, value) => {
    if (value && typeof value === "object") {
        if ("$oid" in value) {
            return new ObjectId(value.$oid);
        } else if ("$date" in value) {
            return new Date(value.$date);
        }
    }
    return value;
};

const importFile = async (database, collectionName, fileContent) => {
    const lines = fileContent.split("\n").filter(line => !!line);
    const documents = lines.map(line => JSON.parse(line, reviver));
    console.log(`${collectionName}: ${documents.length} document(s)`);
    await database.collection(collectionName).insertMany(documents);
};

const jsonFileRegExp = /\.json$/i;

export default async (database, sourceFolder) => {
    console.log(`Importing documents from ${sourceFolder}`);
    const files = await readdir(sourceFolder);
    await Promise.all(files.map(async (fileName) => {
        if (jsonFileRegExp.test(fileName)) {
            const fileContent = await readFile(path.join(sourceFolder, fileName), "utf8");
            await importFile(database, fileName.replace(jsonFileRegExp, ""), fileContent);
        }
    }));
};
