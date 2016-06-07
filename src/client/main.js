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

import "babel-polyfill";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "./main.css";
import createStore from "./state/createStore";
import navigate from "./state/actions/navigate";
import callApi from "./request/callApi";
import Root from "./ui/root";
import React from "react";
import {loadDynComponents} from "@dynComponents";
import { render } from "react-dom";
import { parse } from "./serialization";

const manageURL = async (store) => {
    const location = window.location;
    const getCurrentPath = () => location.pathname;
    const getCurrentSearch = () => location.search;
    const getCurrentRouterStoreState = () => store.getState().get("route");

    let curRouterStoreState = getCurrentRouterStoreState();
    let curPath = getCurrentPath();
    let curSearch = getCurrentSearch();

    store.subscribe(() => {
        const newRouterStoreState = getCurrentRouterStoreState();
        const newPath = newRouterStoreState.get("path");
        const newSearch = newRouterStoreState.get("search");
        if (newPath !== curPath || curSearch !== newSearch) {
            curPath = newPath;
            curSearch = newSearch;
            if (curRouterStoreState.get("navigating")) {
                window.history.replaceState(null, "", `${newPath}${newSearch}`);
            } else {
                window.history.pushState(null, "", `${newPath}${newSearch}`);
            }
        }
        const newTitle = newRouterStoreState.get("title");
        if (newTitle !== curRouterStoreState.get("title")) {
            document.title = newTitle;
        }
        curRouterStoreState = newRouterStoreState;
    });

    window.onpopstate = function () {
        const newPath = getCurrentPath();
        const newSearch = getCurrentSearch();
        if (newPath !== curPath || curSearch !== newSearch) {
            curPath = newPath;
            store.dispatch(navigate(newPath, newSearch));
        }
    };

    await loadDynComponents(curRouterStoreState.get("rootComponent"), ...curRouterStoreState.get("extraComponents"));
};

const manageUnload = (store) => {
    window.addEventListener("beforeunload", function (e) {
        const unsavedData = store.getState().get("unsavedData");
        const unsavedDataSize = unsavedData ? unsavedData.size : 0;
        if (unsavedDataSize === 0) {
            return;
        }
        const confirmationMessage = "Cette page contient des données non enregistrées. Celles-ci seront perdues si vous quittez la page.";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    });
};

window.app = async function (data, domElement) {
    const store = createStore(callApi, parse(data));
    manageUnload(store);
    await manageURL(store);
    React.firstClientRender = true;
    render(<Root store={store} />, domElement);
    React.firstClientRender = false;
};
