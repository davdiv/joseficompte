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

import loginRoutes from "./login";
import appInfo from "@client/appInfo";
import clientRevisionsManager from "./clientRevisionsManager";
import requireAuthentication from "./requireAuthentication";
import * as dynComponents from "@dynComponents";
import pageNotFound from "./pageNotFound";

const requireAuthenticationOnly = requireAuthentication();

export default [
    ...loginRoutes,
    {
        path: "/",
        actions: [requireAuthenticationOnly, (ctx) => {
            ctx.title = `${appInfo.title} - Accueil`;
            ctx.rootComponent = dynComponents.pageHome;
        }]
    },
    clientRevisionsManager({
        path: "/envelope",
        displayComponent: dynComponents.displayEnvelope,
        editComponent: dynComponents.editEnvelope
    }),
    clientRevisionsManager({
        path: "/deposit",
        displayComponent: dynComponents.displayDeposit,
        editComponent: dynComponents.editDeposit
    }),
    {
        path: "/about",
        actions: [requireAuthenticationOnly, (ctx) => {
            ctx.title = `${appInfo.title} - Informations`;
            ctx.rootComponent = dynComponents.pageAbout;
        }]
    },
    {
        path: "/*",
        actions: [pageNotFound]
    }
];
