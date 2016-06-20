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
import deleteValue from "@validation/deleteValue";

export default ({ docTypePath, documentId, revisionId = "latest", refresh }) => async (dispatch, getState) => {
    const cachePath = ["cache", docTypePath, documentId, revisionId];
    const storeState = getState();
    const docInfo = storeState.getIn(cachePath);
    let promise;
    if (docInfo) {
        const revision = docInfo.get("revision");
        if (revision && (!refresh || revisionId !== "latest")) {
            // if revisionId !== "latest", it is not possible for the revision to change
            return revision;
        }
        promise = docInfo.get("promise");
    }
    if (!promise) {
        const promisePath = [...cachePath, "promise"];
        promise = (async () => {
            const callApi = storeState.get("callApi");
            let cacheValue;
            try {
                const {data} = await callApi({
                    method: "GET",
                    path: `/api${docTypePath}/${documentId}/${revisionId}`
                });
                cacheValue = Immutable.Map({
                    revision: data
                });
                if (revisionId === "latest") {
                    // also store the result under the revision id
                    dispatch(setValue(["cache", docTypePath, documentId, data.revisionId], cacheValue));
                }
                return data;
            } catch (err) {
                cacheValue = deleteValue;
                throw err;
            } finally {
                const newPromise = getState().getIn(promisePath);
                // only store the value if the promise is still there:
                if (newPromise === promise) {
                    dispatch(setValue(cachePath, cacheValue));
                }
            }
        })();
        dispatch(setValue(promisePath, promise));
    }
    return await promise;
};
