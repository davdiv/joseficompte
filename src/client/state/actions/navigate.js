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
import appInfo from "@client/appInfo";
import { asyncRouter } from "@client/router";
import { loadDynComponents, pageError } from "@dynComponents";
import pageRoutes from "@client/pageRoutes";
import { parse, stringify } from "query-string";
import setValue from "./setValue";

class Page {}

const updateSearch = function () {
    const search = stringify(this.query);
    this.search = search ? `?${search}` : "";
};

export default (path, search = "", forceRefresh) => async (dispatch, getState) => {
    const questionMark = path.indexOf("?");
    if (questionMark > -1) {
        search = path.slice(questionMark);
        path = path.slice(0, questionMark);
    }
    let storeState = getState();
    if (!forceRefresh && storeState.getIn(["route", "path"]) === path && storeState.getIn(["route", "search"]) === search) {
        // nothing to do!
        return;
    }
    let ctx;
    let page;
    do {
        if (ctx) {
            storeState = getState();
            if (storeState.getIn(["route", "path"]) !== path || storeState.getIn(["route", "search"]) !== search) {
                // something else changed the path in the mean time
                return;
            }
            path = ctx.path;
            search = ctx.search;
        }
        dispatch(setValue(["route"], Immutable.fromJS({
            path: path,
            search: search,
            navigating: true,
            title: `${appInfo.title} - Chargement...`
        })));
        page = new Page();
        ctx = {
            path: path,
            search: search,
            query: parse(search),
            updateSearch: updateSearch,
            status: 200,
            getState: getState,
            dispatch: dispatch,
            title: "" || appInfo.title,
            rootComponent: null,
            extraComponents: [],
            data: {}
        };
        try {
            await asyncRouter(pageRoutes, ctx);
        } catch (error) {
            ctx.title = "Erreur";
            ctx.status = error.status || 500;
            ctx.data.error = error;
            ctx.rootComponent = pageError;
            break;
        }
    } while (path !== ctx.path || search !== ctx.search);
    await loadDynComponents(ctx.rootComponent, ...ctx.extraComponents);
    storeState = getState();
    if (storeState.getIn(["route", "path"]) !== path || storeState.getIn(["route", "search"]) !== search) {
        // something else changed the path in the mean time
        return;
    }
    dispatch(setValue(["route"], Immutable.fromJS({
        path: path,
        search: search,
        navigating: false,
        status: ctx.status,
        title: ctx.title,
        rootComponent: ctx.rootComponent,
        extraComponents: ctx.extraComponents,
        data: ctx.data,
        page: page
    })));
};
