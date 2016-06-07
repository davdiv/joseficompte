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

const amountRegExp = /^\s*([-+]?)\s*([0-9]+)(?:[.,]([0-9]{0,2}))?\s*(?:€|EUR)?\s*$/i;

const pad2Right = function (str) {
    return (str.length == 1) ? `${str}0` : str;
};

export default function (strValue) {
    if (!strValue) {
        return null;
    }
    const match = amountRegExp.exec(strValue);
    if (!match) {
        throw new Error("Montant invalide.");
    }
    const sign = match[1] === "-" ? -1 : 1;
    const value = parseInt(match[2], 10);
    const decimalValue = match[3] ? parseInt(pad2Right(match[3]), 10) : 0;
    const result = sign * (value * 100 + decimalValue);
    return result;
}
