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
import TextInput from "../textInput";
import ShowValidation from "../showValidation";
import formatAmount from "../../formatting/amount";
import formatNumber from "../../formatting/number";

const numberRegExp = /^\s*(-?)\s*([0-9]+)\s*$/;

const inputStyle = {
    textAlign: "right"
};
const addonAfterStyle = {
    minWidth: "65px",
    textAlign: "right",
    display: "inline-block"
};
const amountButtonStyle = {
    minWidth: "65px",
    display: "inline-block"
};
const wrapperStyle = {
    margin: "5px"
};

export default class extends TextInput {
    format (value) {
        return formatNumber(value);
    }

    parse (entry) {
        entry = entry.trim();
        if (!entry) {
            return 0;
        }
        const match = numberRegExp.exec(entry);
        if (!match) {
            throw new Error("Invalid number");
        }
        return parseInt(match[2], 10) * (match[1] ? -1 : 1);
    }

    onButtonMouseDown (evt) {
        evt.preventDefault();
    }

    onButtonClick (inc) {
        const newValue = this.state.value + inc;
        this.requestChange(newValue, this.format(newValue));
    }

    computeInputProps() {
        const res = super.computeInputProps();
        delete res.unitValue;
        return res;
    }

    render () {
        const inputProps = this.computeInputProps();
        inputProps.type = "text";
        inputProps.className = "form-control";
        inputProps.style = inputStyle;
        const unitValue = this.props.unitValue;
        return <ShowValidation style={wrapperStyle} value={this.props.valueLink.value}>
                <div className="input-group">
                    <span onMouseDown={this.onButtonMouseDown.bind(this)} className="input-group-btn">
                        <button onClick={() => this.onButtonClick(-1)} tabIndex={-1} className="btn btn-default"><span className="glyphicon glyphicon-minus" /></button>
                        <button tabIndex={-1} className="btn btn-default"><span style={amountButtonStyle}>{formatAmount(unitValue)}</span></button>
                        <button onClick={() => this.onButtonClick(1)} tabIndex={-1} className="btn btn-default"><span className="glyphicon glyphicon-plus"/></button>
                    </span>
                    <input {...inputProps}/>
                    <span className="input-group-addon"><span style={addonAfterStyle}>{formatAmount(this.state.value * unitValue)}</span></span>
                </div>
            </ShowValidation>;
    }

}
