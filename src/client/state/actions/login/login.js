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
import setPageData from "../setPageData";
import setValue from "../setValue";
import navigate from "../navigate";

const processing = Immutable.Map({
    processing: true
});

export default () => async (dispatch, getState) => {
    const callApi = getState().get("callApi");
    const page = getState().getIn(["route", "page"]);
    const postData = {
        email: getState().getIn(["route", "data", "email"]),
        password: getState().getIn(["route", "data", "password"])
    };
    try {
        dispatch(setPageData(page, processing));
        const {data} = await callApi({
            method: "POST",
            path: "/api/login/login",
            data: postData
        });
        dispatch(setValue(["session"], data.get("session")));
        dispatch(navigate(getState().getIn(["route", "path"]), getState().getIn(["route", "search"]), true));
    } catch (error) {
        dispatch(setPageData(page, Immutable.Map({
            error: error,
            email: postData.email
        })));
    }
};
