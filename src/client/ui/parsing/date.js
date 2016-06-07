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

const datePattern = /^\s*([0-9]+)[-.\/ ]([0-9]+)[-.\/ ]([0-9]{4})\s*$/;

export function parseDate (date) {
    if (!date) {
        return null;
    }
    const match = datePattern.exec(date);
    if (!match) {
        throw new Error("Date invalide.");
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const res = new Date(Date.UTC(year, month, day));
    if (res.getUTCDate() != day || res.getUTCMonth() != month || res.getUTCFullYear() != year) {
        throw new Error("Date invalide.");
    }
    return res;
}
