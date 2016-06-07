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

export default function(model) {
    let totalSum = 0;
    model.get("days").forEach((day, dayIndex) => {
        let daySum = 0;
        day.get("lines").forEach(line => {
            const amount = line.get("amount");
            daySum += amount;
        });
        model = model.setIn(["days", dayIndex, "sumAmount"], daySum);
        totalSum += daySum;
    });
    model = model.set("sumAmount", totalSum);
    const cashbox = model.get("countedAmountDetails");
    if (cashbox) {
        model = model.set("countedAmount", cashbox.getIn(["total", "total", "total"]));
    }
    const countedAmount = model.get("countedAmount");
    model = model.set("difference", countedAmount - totalSum);
    return model;
}
