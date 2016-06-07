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

export default (url, {headers, method, data} = {}) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method || "GET", url, true);
    for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onreadystatechange = () => {
        if (xhr && xhr.readyState == 4) {
            const status = xhr.status;
            const success = (status >= 200 && status < 300) || status === 302;
            (success ? resolve : reject)({
                status: status,
                responseText: xhr.responseText
            });
        }
    };
    xhr.send(data);
});
