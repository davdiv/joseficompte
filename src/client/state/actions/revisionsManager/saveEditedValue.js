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
import deleteValue from "../../deleteValue";

export default ({ editionHref, docTypePath, documentId }) => async (dispatch, getState) => {
    const storeState = getState();
    const callApi = storeState.get("callApi");
    const unsavedData = storeState.getIn(["unsavedData", editionHref]);
    if (!unsavedData) {
        return;
    }
    let data;
    if (!documentId) {
        ({data} = await callApi({
            method: "POST",
            path: `/api${docTypePath}`,
            data: unsavedData
        }));
        documentId = data.get("documentId");
    } else {
        ({data} = await callApi({
            method: "POST",
            path: `/api${docTypePath}/${documentId}`,
            data: {
                lastRevisionId: storeState.getIn(["cache", docTypePath, documentId, "latest", "revision", "revisionId"]),
                content: unsavedData
            }
        }));
    }
    const cacheValue = Immutable.Map({
        revision: data
    });
    dispatch(setValue(["cache", docTypePath, documentId, data.revisionId], cacheValue));
    dispatch(setValue(["cache", docTypePath, documentId, "latest"], cacheValue));
    dispatch(setValue(["unsavedData", editionHref], deleteValue));
    dispatch(navigate(`${docTypePath}/${documentId}`));
};
