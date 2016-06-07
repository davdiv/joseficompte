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

import {object, string} from "@validation";
import password from "@validation/password";
import {buildQuery} from "./checkLink";
import {hashPassword} from "../passwordMgr";

const expectedBody = object({
    id: string,
    password: password
});

export default async (ctx) => {
    if (ctx.method !== "POST") {
        ctx.throw(403);
    }
    const data = await ctx.readJsonBody(expectedBody);
    const database = ctx.application.config.database;
    const query = buildQuery(ctx, data.get("id"));
    const dbQueryRes = await database.collection("resetPasswordEmails").findOneAndUpdate(query, {
        $set: {
            enabled: false
        }
    });
    const emailInfo = dbQueryRes.value;
    if (!emailInfo) {
        // does not match any e-mail!
        ctx.throw(403, "Le lien que vous avez utilisé n'est pas (ou plus) valide!");
    }
    const hashedPassword = await hashPassword(data.get("password"));
    hashedPassword._id = emailInfo.userId;
    hashedPassword.date = new Date();
    await database.collection("passwords").findOneAndReplace({
        _id: emailInfo.userId
    }, hashedPassword, {
        upsert: true
    });
    // Logs out any currently logged in session:
    await database.collection("sessions").updateMany({
        userId: emailInfo.userId,
        enabled: true
    }, {
        $set: {
            enabled: false
        }
    });
    ctx.body = {};
};
