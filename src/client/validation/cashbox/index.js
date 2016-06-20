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

import {array, object, integer, date, string, validator, optional} from "@validation";
import cashValues from "./cashValues";
import recompute from "./recompute";

const banknotesOrCoins = (type) => {
    const res = {};
    cashValues[type].forEach(unitValue => res[`${unitValue}`] = optional(integer));
    return object(res);
};

const checks = array(object({
    checkBank: optional(string),
    checkNumber: optional(string),
    checkDate: optional(date),
    total: integer
}));

const total = object({
    number: integer,
    total: integer
});

export default validator([object({
    coins: banknotesOrCoins("coins"),
    banknotes: banknotesOrCoins("banknotes"),
    checks: checks,
    total: object({
        coins: total,
        banknotes: total,
        checks: total,
        total: total
    })
}), recompute]);
