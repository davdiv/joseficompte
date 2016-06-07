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

import { validator, regExp, minLength, maxLength, string, validationFailure } from "./index";

const invalidPassword = validationFailure("email");
const check = validator([string, minLength(10), maxLength(160), regExp(/[a-z]/), regExp(/[A-Z]/), regExp(/[0-9]/), regExp(/[^a-zA-Z0-9]/)]);

export default (value) => {
    try {
        return check(value);
    } catch (ex) {
        throw invalidPassword;
    }
};
