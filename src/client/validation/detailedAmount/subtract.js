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
import defaultCashbox from "@validation/cashbox/default";
import subtractCashbox from "@validation/cashbox/subtract";

export default (item1, item2) => {
    const amount1 = item1.get("amount");
    const amount2 = item2.get("amount");
    const details1 = item1.get("details") || (amount1 === 0 ? defaultCashbox : null);
    const details2 = item2.get("details") || (amount2 === 0 ? defaultCashbox : null);
    return Immutable.Map({
        amount: amount1 - amount2,
        details: details1 && details2 ? subtractCashbox(details1, details2) : null
    });
};
