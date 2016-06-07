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
    const data = {
        email: getState().getIn(["route", "data", "email"])
    };
    try {
        dispatch(setPageData(page, processing));
        const {data: sentEmail} = await callApi({
            method: "POST",
            path: "/api/login/resetPassword/sendEmail",
            data: data
        });
        dispatch(setPageData(page, Immutable.fromJS({
            email: data.email,
            sentEmail: sentEmail
        })));
    } catch (error) {
        dispatch(setPageData(page, Immutable.fromJS({
            email: data.email,
            error: error
        })));
    }
};
