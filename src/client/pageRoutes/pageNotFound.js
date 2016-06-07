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

import appInfo from "@client/appInfo";
import {pageError} from "@dynComponents";

export default async (ctx) => {
    ctx.status = 404;
    ctx.title = `${appInfo.title} - Page introuvable`;
    ctx.data.error = new Error("La page que vous avez demandée est introuvable.");
    ctx.rootComponent = pageError;
};
