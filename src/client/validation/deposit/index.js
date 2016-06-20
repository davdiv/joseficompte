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

import {validator, object, string, array, date, id, optional} from "@validation";
import detailedAmount from "@validation/detailedAmount";
import recompute from "./recompute";

export default validator([object({
    date: date,
    reference: optional(string),
    deposit: detailedAmount,
    refusal: optional(object({
        amount: detailedAmount,
        reason: string
    })),
    total: detailedAmount,
    tags: array(id),
    comments: optional(string)
}), recompute]);
