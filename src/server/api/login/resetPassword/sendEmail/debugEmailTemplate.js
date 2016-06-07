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
import {generateEmail} from "./emailTemplate";
import generateSecureId from "../../generateSecureId";

export default async (ctx) => {
    const email = generateEmail(ctx.application, {
        _id: await generateSecureId(),
        ip: ctx.ip,
        userAgent: ctx.get("User-Agent"),
        date: new Date(),
        email: "a@b.cd",
        enabled: true,
        expirationDate: new Date(),
        sessionId: null,
        userId: (new ObjectId()).toHexString(),
        userDisplayName: ctx.query.userDisplayName || "Jean Dupont",
        userRoles: ["admin"]
    });
    const html = ctx.query.format !== "text";
    if (html) {
        ctx.body = email.html;
    } else {
        ctx.body = email.text;
        ctx.type = "text/plain";
    }
};
