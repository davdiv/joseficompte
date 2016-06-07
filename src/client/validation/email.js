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

import {validationFailure, validator, string} from "./index";
const invalidEmail = validationFailure("email");

export default validator([string, (email) => {
    // cf https://www.owasp.org/index.php/Input_Validation_Cheat_Sheet#Email_Address_Validation
    const localPartLength = email.lastIndexOf("@");
    const domainPartLength = email.length - localPartLength - 1;
    if (localPartLength < 1 || localPartLength > 64 || domainPartLength < 1 || domainPartLength > 255) {
        throw invalidEmail;
    }
    // normalizes the e-mail address:
    const localPart = email.slice(0, localPartLength);
    const domainPart = email.slice(localPartLength + 1);
    return `${localPart}@${domainPart.toLowerCase()}`;
}]);
