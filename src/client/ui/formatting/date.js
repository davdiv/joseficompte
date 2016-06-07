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

const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const formatDayOfWeek = (jsDate) => {
    if (!(jsDate instanceof Date)) {
        return "";
    }
    return daysOfWeek[jsDate.getDay()];
};

export const formatDate = (value) => value instanceof Date ? `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}` : "";

export const formatTimestamp = (value) => value instanceof Date ?
    `${formatDate(value)} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}` : "";
