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

import Immutable from "immutable";

// To avoid floating point operation issues, all amounts are in centimes
const COINS = Immutable.List.of(200, 100, 50, 20, 10, 5, 2, 1);
const BANKNOTES = Immutable.List.of(50000, 20000, 10000, 5000, 2000, 1000, 500);

const initUnitValue = Immutable.Map({
    unitValue: 1,
    number: 0,
    total: 0
});

const initTotalValue = Immutable.Map({
    total: 0,
    number: 0
});

const initObject = function(unitValue) {
    return initUnitValue.set("unitValue", unitValue);
};

export default Immutable.Map({
    coins: COINS.map(initObject),
    banknotes: BANKNOTES.map(initObject),
    checks: Immutable.List(),
    total: Immutable.Map({
        coins: initTotalValue,
        banknotes: initTotalValue,
        checks: initTotalValue,
        total: initTotalValue
    })
});
