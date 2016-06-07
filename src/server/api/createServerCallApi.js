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

import Immutable from "immutable";
import {asyncRouter} from "@client/router";
import apiRoutes from "./apiRoutes";

export default (ctx) => (getState) => async ({method, path, query, data, headers} = {}) => {
    headers = headers || {};
    const csrfToken = getState().getIn(["session", "csrfToken"]);
    if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
    }
    if (method == "GET" || method == "HEAD") {
        data = null;
    } else {
        headers["Content-Type"] = "application/json";
    }
    const wrappedCtx = {
        application: ctx.application,
        method: method || "GET",
        path: path,
        query: query || {},
        cookies: ctx.cookies,
        session: ctx.session,
        ip: ctx.ip,
        throw: ctx.throw,
        get: (header) => headers[header] || ctx.get(header),
        readJsonBody: async (validator) => validator(Immutable.fromJS(data)),
        status: 404,
        body: undefined
    };
    await asyncRouter(apiRoutes, wrappedCtx);
    const body = Immutable.fromJS(wrappedCtx.body);
    const status = wrappedCtx.status;
    ctx.session = wrappedCtx.session;
    const success = (status >= 200 && status < 300) || status === 302;
    if (success) {
        return {
            data: body,
            status: status
        };
    } else {
        throw body;
    }
};
