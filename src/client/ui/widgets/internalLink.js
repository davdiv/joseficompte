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

import React from "react";
import navigate from "@client/state/actions/navigate";
import {connect} from "react-redux";
import { stringify as stringifyQuery } from "query-string";

const InternalLink = (props) => {
    const {path, query} = props;
    let {href, search = ""} = props;
    if (path) {
        if (query) {
            search = stringifyQuery(query);
            if (search) {
                search = `?${search}`;
            }
        }
        href = `${path}${search}`;
    }
    const linkProps = Object.assign({}, props);
    delete linkProps.path;
    delete linkProps.search;
    delete linkProps.query;
    linkProps.href = href;
    delete linkProps.dispatch;
    linkProps.onClick = (event) => {
        event.preventDefault();
        props.dispatch(navigate(href));
    };
    return <a {...linkProps} />;
};

export default connect()(InternalLink);
