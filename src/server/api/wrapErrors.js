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

export default async (ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            if (ctx.body !== undefined) {
                ctx.status = 200;
            } else {
                ctx.throw(404);
            }
        }
    } catch (err) {
        if (err.expose) {
            ctx.status = err.status;
            ctx.body = err;
        } else {
            console.log(err);
            ctx.status = 500;
            ctx.body = new Error("Une erreur inconnue s'est produite. Veuillez réessayer ou contacter l'administrateur de l'application.");
        }
    }
};
