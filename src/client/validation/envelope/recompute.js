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

import comparingSetIn from "@validation/comparingSetIn";
import addAmounts from "@validation/detailedAmount/add";
import subtractAmount from "@validation/detailedAmount/subtract";

export default function(model) {
    const totalSum = [];
    model.get("days").forEach((day, dayIndex) => {
        const daySum = [];
        day.get("lines").forEach(line => {
            const amount = line.get("amount");
            daySum.push(amount);
        });
        const daySumResult = addAmounts(...daySum);
        model = comparingSetIn(model, ["days", dayIndex, "sumAmount"], daySumResult);
        totalSum.push(daySumResult);
    });
    const totalSumResult = addAmounts(...totalSum);
    model = comparingSetIn(model, ["sumAmount"], totalSumResult);
    model = comparingSetIn(model, ["difference"], subtractAmount(model.get("countedAmount"), totalSumResult));
    return model;
}
