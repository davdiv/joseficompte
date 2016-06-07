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
import { connect } from "react-redux";
import setPageData from "@actions/setPageData";
import Processing from "@widgets/processing";
import DynComponent from "@widgets/dynComponent";

const maskStyle = {
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
};

const processingIndicatorStyle = {
    width: "32px",
    height: "32px",
    position: "absolute",
    top: "50%",
    left: "50%",
    margin: "-16px 0 0 -16px"
};

const Router = ({storeState, dispatch}) => {
    if (storeState.getIn(["route", "navigating"])) {
        return <div style={maskStyle}><div style={processingIndicatorStyle}><Processing/></div></div>;
    }
    const data = storeState.getIn(["route", "data"]);
    const page = storeState.getIn(["route", "page"]);
    const valueLink = {
        value: data,
        requestChange: (value) => dispatch(setPageData(page, value))
    };
    return <DynComponent dynComponent={storeState.getIn(["route", "rootComponent"])} value={data} valueLink={valueLink}/>;
};

export default connect((state) => ({ storeState: state }))(Router);
