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

import constantTime from "./constantTime";
import generateSecureId from "./generateSecureId";
import {checkPassword} from "./passwordMgr";
import {object} from "@validation";
import password from "@validation/password";
import email from "@validation/email";
import sessionInfo from "./sessionInfo";
import limitAuthenticationFailures from "./limitAuthenticationFailures";

const loginTime = 1000; // 1s

const expectedBody = object({
    email: email,
    password: password
});

export default async (ctx) => {
    if (ctx.method !== "POST" || ctx.session) {
        ctx.throw(403);
    }
    await constantTime(loginTime, async () => {
        const database = ctx.application.config.database;
        const currentDate = new Date();
        let user;

        await limitAuthenticationFailures(ctx, async () => {
            let passwordInfo;
            const data = await ctx.readJsonBody(expectedBody);
            user = await database.collection("users").find({
                "keys.email": data.get("email")
            }).limit(1).next();

            if (user) {
                passwordInfo = await database.collection("passwords").find({
                    _id: user._id
                }).limit(1).next();
            }

            await checkPassword(data.get("password"), passwordInfo);
        });

        const userInfo = user.revision.content;
        // creates the session
        const session = {
            _id: await generateSecureId(),
            csrfToken: await generateSecureId(),
            ip: ctx.ip,
            userAgent: ctx.get("User-Agent"),
            enabled: true,
            requests: 1,
            firstRequest: currentDate,
            lastRequest: currentDate,
            userId: user._id,
            userDisplayName: userInfo.displayName,
            userRoles: userInfo.userRoles
        };
        await database.collection("sessions").insertOne(session);
        ctx.cookies.set("id", session._id, {
            httpOnly: true,
            overwrite: true
        });
        ctx.session = session;
        ctx.body = {
            session: sessionInfo(session)
        };
    });
};
