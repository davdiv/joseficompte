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

import { stringify, parse } from "../serialization";
import { stringify as stringifyQuery } from "query-string";
import request from "./request";

export default (getState) => async ({method, path, query, data, headers} = {}) => {
    method = method || "GET";
    headers = headers || {};
    if (method == "GET" || method == "HEAD") {
        data = null;
    } else {
        data = stringify(data);
        headers["Content-Type"] = "application/json";
    }
    const csrfToken = getState().getIn(["session", "csrfToken"]);
    if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
    }
    let res;
    try {
        res = await request(`${path}${ query ? `?${stringifyQuery(query)}` : ""}`, {headers, method, data});
    } catch (error) {
        let rethrownError = error;
        const responseText = rethrownError.responseText;
        if (responseText) {
            try {
                rethrownError = parse(responseText);
            } catch (ignoreError) {/* Ignore the error */}
        }
        throw rethrownError;
    }
    const responseText = res.responseText;
    return {
        data: responseText ? parse(responseText) : null,
        status: res.status
    };
};
