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

const args = require("minimist")(process.argv.slice(2));
const {Server, Db} = require("mongodb");

const {db = "test", host = "localhost", port = "27017", username, password} = args;

const server = new Server(host, port);
const database = new Db(db, server);

database.open()
    .then(() => username ? database.authenticate(username, password) : null)
    .then(() => database.listCollections().toArray())
    .then((collections) => console.log(collections.map(collection => collection.name).filter((name) => name.indexOf(".") === -1).join(" ")))
    .then(() => database.close())
    .catch(e => console.error(e))
    .then(() => process.exit());
