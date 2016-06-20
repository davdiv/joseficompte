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

const recomputeTotalCoinsOrBanknotes = function(data, property) {
    let totalNumber = 0;
    let totalTotal = 0;
    data.get(property).forEach((value, key) => {
        if (value === 0) {
            data = data.deleteIn([property, key]);
        } else {
            totalNumber += value;
            totalTotal += value * key;
        }
    });
    data = data.setIn(["total", property, "number"], totalNumber);
    data = data.setIn(["total", property, "total"], totalTotal);
    return data;
};

const recomputeTotal = function(data, property) {
    let totalNumber = 0;
    let totalTotal = 0;
    data.get(property).forEach(function(curObject, key) {
        if (key !== "total") {
            const number = curObject.get("number");
            if (typeof number == "number") {
                totalNumber += number;
            } else {
                // this is for checks
                totalNumber += 1;
            }
            totalTotal += curObject.get("total");
        }
    });
    data = data.setIn(["total", property, "number"], totalNumber);
    data = data.setIn(["total", property, "total"], totalTotal);
    return data;
};

export default function (data) {
    data = recomputeTotalCoinsOrBanknotes(data, "coins");
    data = recomputeTotalCoinsOrBanknotes(data, "banknotes");
    data = recomputeTotal(data, "checks");
    data = recomputeTotal(data, "total");
    return data;
}
