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

// when there is no activity, here is the timeout:
const idleTimeout = 15 * 60 * 1000; // 15 min (in milliseconds)
// even if there is some activity, here is the maximum duration of a session:
const absoluteTimeout = 12 * 60 * 60 * 1000; // 6 h

export default async (ctx, next) => {
    const sessionId = ctx.cookies.get("id");
    if (sessionId) {
        const currentDate = new Date();
        const lastRequestLimit = new Date(currentDate.getTime() - idleTimeout);
        const firstRequestLimit = new Date(currentDate.getTime() - absoluteTimeout);
        const dbQueryRes = await ctx.application.config.database.collection("sessions").findOneAndUpdate({
            _id: sessionId,
            enabled: true,
            ip: ctx.ip,
            userAgent: ctx.get("User-Agent"),
            firstRequest: {
                $gte: firstRequestLimit
            },
            lastRequest: {
                $gte: lastRequestLimit
            }
        }, {
            $inc: {
                requests: 1
            },
            $set: {
                lastRequest: currentDate
            }
        });
        const session = ctx.session = dbQueryRes.value;
        if (!session) {
            // there can be multiple reasons:
            // - session expired
            // - different user agent (this is suspicious...)
            // ...
            ctx.cookies.set("id", null, {
                overwrite: true,
                expires: new Date(0)
            });
        }
    }
    await next();
};
