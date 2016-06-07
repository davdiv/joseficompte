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

const expectedBody = object({
    id: string
});

export const buildQuery = (ctx, id) => ({
    _id: id,
    ip: ctx.ip,
    userAgent: ctx.get("User-Agent"),
    enabled: true,
    expirationDate: {
        $gte: new Date()
    }
});

export default async (ctx) => {
    if (ctx.method !== "POST") {
        ctx.throw(403);
    }
    const data = await ctx.readJsonBody(expectedBody);
    const database = ctx.application.config.database;
    const query = buildQuery(ctx, data.get("id"));
    const emailInfo = await database.collection("resetPasswordEmails").find(query).limit(1).next();
    if (!emailInfo) {
        // does not match any e-mail!
        ctx.throw(403, "Le lien que vous avez utilisé n'est pas (ou plus) valide!");
    }
    ctx.body = {
        id: data.get("id"),
        email: emailInfo.email
    };
};
