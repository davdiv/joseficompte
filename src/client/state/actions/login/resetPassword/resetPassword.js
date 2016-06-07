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
import setPageData from "../../setPageData";

const processing = Immutable.Map({
    processing: true
});

export default () => async (dispatch, getState) => {
    const callApi = getState().get("callApi");
    const page = getState().getIn(["route", "page"]);
    const id = getState().getIn(["route", "data", "id"]);
    const email = getState().getIn(["route", "data", "email"]);
    const password1 = getState().getIn(["route", "data", "password1"]);
    const password2 = getState().getIn(["route", "data", "password2"]);
    try {
        if (!password1 || !password2 || password1 !== password2) {
            throw new Error("Veuillez entrer deux fois le même mot de passe.");
        }
        dispatch(setPageData(page, processing));
        const {data: done} = await callApi({
            method: "POST",
            path: "/api/login/resetPassword/resetPassword",
            data: {
                id: id,
                password: password1
            }
        });
        dispatch(setPageData(page, Immutable.fromJS({
            done: done
        })));
    } catch (error) {
        dispatch(setPageData(page, Immutable.fromJS({
            id: id,
            email: email,
            error: error
        })));
    }
};
