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

import {validator, object, string, array, date, integer, id, optional} from "@validation";
import cashbox from "@validation/cashbox";
import recompute from "./recompute";

export default validator([object({
    date: date,
    reference: optional(string),
    deposit: object({
        amount: integer,
        amountDetails: optional(cashbox)
    }),
    refusal: optional(object({
        amount: integer,
        amountDetails: optional(cashbox),
        reason: string
    })),
    total: integer,
    tags: array(id),
    comments: optional(string)
}), recompute]);
