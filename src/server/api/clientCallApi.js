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

import getRawBody from "raw-body";
import {asyncRouter} from "@client/router";
import {parse, stringify} from "@client/serialization";
import apiRoutes from "./apiRoutes";

export default async (ctx) => {
    const wrappedCtx = {
        application: ctx.application,
        method: ctx.method,
        path: ctx.path,
        query: ctx.query,
        cookies: ctx.cookies,
        session: ctx.session,
        ip: ctx.ip,
        throw: ctx.throw,
        get: (header) => ctx.get(header),
        readJsonBody: async (validator) => {
            const result = await getRawBody(ctx.req, {
                length: ctx.request.length,
                limit: "1mb",
                encoding: "utf-8"
            });
            return validator(parse(result));
        },
        status: 404,
        body: undefined
    };
    await asyncRouter(apiRoutes, wrappedCtx);
    ctx.session = wrappedCtx.session;
    ctx.body = stringify(wrappedCtx.body);
    ctx.type = "application/json";
    ctx.status = wrappedCtx.status;
};
