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

export default {
    name: "console",
    version: "0.1.0",
    send: (mail, callback) => {
        console.log("********************************************************************************");
        console.log(mail.message.buildHeaders());
        console.log("********************************************************************************");
        console.log(mail.data.text);
        console.log("********************************************************************************\n");
        setTimeout(() => callback(null, true), 1000);
    }
};
