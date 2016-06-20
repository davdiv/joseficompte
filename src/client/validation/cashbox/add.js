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

import defaultCashbox from "./default";
import recompute from "./recompute";

export default (...items) => {
    let result = defaultCashbox;
    const processCoinsOrBanknotes = (property) => (number, unitValue) => {
        result = result.setIn([property, unitValue], result.getIn([property, unitValue], 0) + number);
    };
    const processCoins = processCoinsOrBanknotes("coins");
    const processBanknotes = processCoinsOrBanknotes("banknotes");
    items.forEach(cashbox => {
        cashbox.get("coins").forEach(processCoins);
        cashbox.get("banknotes").forEach(processBanknotes);
        result = result.set("checks", result.get("checks").concat(cashbox.get("checks")));
    });
    return recompute(result);
};
