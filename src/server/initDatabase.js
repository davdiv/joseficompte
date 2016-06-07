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

import {databaseHeader} from "../../package.json"; // the path to package.json is relative to the build output
import importDatabase from "./importDatabase";

export default async function (database, sourceFolder) {
    await database.collection("users").createIndexes([{
        key: {
            "keys.email": 1
        },
        name: "email",
        unique: true,
        sparse: true
    }]);

    let generalEntry;
    if (sourceFolder) {
        await importDatabase(database, sourceFolder);
        generalEntry = await database.collection("general").find().limit(1).next();
    }

    if (!generalEntry) {
        await database.collection("general").insertOne({
            application: databaseHeader.application,
            dbVersion: databaseHeader.dbVersion,
            date: new Date()
        });
    }
}
