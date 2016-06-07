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

const dynComponentsArray = [];
const dynComponentDef = function (dynComponentGetter) {
    dynComponentsArray.push(dynComponentGetter);
    return dynComponentsArray.length;
};

export const loadDynComponent = async (dynComponentId) => dynComponentId ? await new Promise(resolve => {
    const dynComponentGetter = dynComponentsArray[dynComponentId - 1];
    dynComponentGetter(resolve);
}) : null;

export const loadDynComponents = async (...dynComponentIds) => await Promise.all(dynComponentIds.map(loadDynComponent));

export const getDynComponent = (dynComponentId) => {
    let result = null;
    if (dynComponentId) {
        const dynComponentGetter = dynComponentsArray[dynComponentId - 1];
        dynComponentGetter((value) => result = value);
    }
    return result;
};

export const pageLoginLogin = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/login/login").default)));
export const pageLoginSendEmail = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/login/sendEmail").default)));
export const pageLoginResetPassword = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/login/resetPassword").default)));
export const pageAbout = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/about").default)));
export const pageError = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/error").default)));
export const pageHome = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/home").default)));

export const pageRevisionContainer = dynComponentDef(cb => require.ensure([], require => cb(require("@dynComponents/revisionContainer").default)));

export const displayEnvelope = dynComponentDef(cb => require.ensure([], require => cb(require("@widgets/envelope/envelopeDisplay").default)));
export const editEnvelope = dynComponentDef(cb => require.ensure([], require => cb(require("@widgets/envelope/envelopeInput").default)));

export const displayDeposit = dynComponentDef(cb => require.ensure([], require => cb(require("@widgets/deposit/depositDisplay").default)));
export const editDeposit = dynComponentDef(cb => require.ensure([], require => cb(require("@widgets/deposit/depositInput").default)));
