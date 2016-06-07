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

const maxFailures = 10; // it is impossible to try again if there is more than this number of failures
const maxFailuresWindow = 2 * 60 * 60 * 1000; // 2 h

const errorMessage = "Erreur d'authentification!";

export default async (ctx, fn) => {
    const currentDate = new Date();
    const database = ctx.application.config.database;

    // counts the number of authentication errors for that IP address
    const errorsCount = await database.collection("authenticationErrors").count({
        ip: ctx.ip,
        date: {
            $gte: new Date(currentDate - maxFailuresWindow)
        }
    }, {
        limit: maxFailures
    });
    if (errorsCount >= maxFailures) {
        ctx.throw(403, errorMessage);
    }

    try {
        await fn();
    } catch (e) {
        await database.collection("authenticationErrors").insertOne({
            date: currentDate,
            path: ctx.path,
            ip: ctx.ip,
            userAgent: ctx.get("User-Agent")
        });
        ctx.throw(403, errorMessage);
    }
};
