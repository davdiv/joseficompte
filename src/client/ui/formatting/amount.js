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

import pad from "./pad";

export default function(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        return "";
    }
    const sign = amount >= 0 ? "" : "-";
    const absValue = Math.abs(amount);
    return `${sign}${Math.floor(absValue / 100)}.${pad(absValue % 100)} €`;
}
