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
import setValue from "../setValue";
import navigate from "../navigate";

export default () => async (dispatch, getState) => {
    const unsavedData = getState().get("unsavedData");
    const unsavedDataSize = unsavedData ? unsavedData.size : 0;
    if (unsavedDataSize > 0) {
        const confirmation = confirm("Cette page contient des données non enregistrées. Celles-ci seront perdues si vous vous déconnectez.\n\nEtes-vous sûr(e) de vouloir vous déconnecter?");
        if (!confirmation) {
            return;
        }
    }
    const callApi = getState().get("callApi");
    await callApi({
        method: "POST",
        path: "/api/login/logout"
    });
    // clear the data model:
    dispatch(setValue([], Immutable.fromJS({
        callApi: callApi,
        client: true,
        route: {
            path: "/",
            search: "",
            navigating: true,
            title: "Déconnexion..."
        }
    })));
    dispatch(navigate("/", "", true));
};
