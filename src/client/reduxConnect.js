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

import setValue from "@client/state/actions/setValue";
import {connect} from "react-redux";

const defaultMapStateToProps = () => ({});
const defaultMapDispatchToProps = (dispatch) => ({dispatch: dispatch});
const copyAndMapObject = (dst, src, fn) => {
    Object.keys(src).forEach(key => {
        dst[key] = fn(src[key]);
    });
    return dst;
};

export default (bindings, mapStateToProps = defaultMapStateToProps, mapDispatchToProps = defaultMapDispatchToProps) => connect(
    (state) => copyAndMapObject(mapStateToProps(state), bindings, path => state.getIn(path)),
    (dispatch) => copyAndMapObject(mapDispatchToProps(dispatch), bindings, path => (newValue) => dispatch(setValue(path, newValue))),
    (stateProps, dispatchProps, ownProps) => {
        const res = Object.assign({}, ownProps, stateProps, dispatchProps);
        Object.keys(bindings).forEach(key => {
            res[key] = {
                value: stateProps[key],
                requestChange: dispatchProps[key]
            };
        });
        return res;
    });
