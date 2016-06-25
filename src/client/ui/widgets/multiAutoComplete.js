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
import Immutable from "immutable";
import ValueLink from "@validation/valueLink";
import AutoComplete from "./autoComplete";
import ActionLink from "./actionLink";

const containerStyle = {
    cursor: "text",
    height: "auto",
    padding: "0px 5px"
};

const inputStyle = {
    margin: "5px",
    border: "none",
    outline: "none",
    width: "auto"
};

const selectedValueStyle = {
    display: "inline-block",
    padding: "2px",
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    borderRadius: "3px",
    margin: "2px"
};

const defaultSelectionDisplay = ({value}) => <span>{value}</span>;

export default class extends React.Component {
    onChooseSuggestion(event) {
        event.entry = "";
        const valueLink = this.valueLink;
        valueLink.requestChange(valueLink.value.push(event.suggestion));
    }

    onDeleteSuggestion(value, index) {
        const valueLink = this.valueLink;
        valueLink.requestChange(valueLink.value.splice(index, 1));
    }

    render() {
        const {SelectionDisplay = defaultSelectionDisplay, valueLink} = this.props;
        this.valueLink = ValueLink.wrapValidator(valueLink, null, Immutable.List());
        const selectedValues = this.valueLink.value;
        return <div className="form-control input-sm" style={containerStyle} onMouseDown={(event)=>{event.preventDefault();this.input.focus();}}>
                {selectedValues.map((value, index) => <span key={index} style={selectedValueStyle}>
                    <SelectionDisplay value={value}/>&nbsp;
                    <ActionLink onClick={()=>this.onDeleteSuggestion(value, index)}><span className="glyphicon glyphicon-remove"/></ActionLink>
                </span>)}
                <AutoComplete
                    SuggestionDisplay={this.props.SuggestionDisplay || SelectionDisplay}
                    onComputeSuggestions={this.props.onComputeSuggestions}
                    onChooseSuggestion={(event)=>this.onChooseSuggestion(event)}>
                        <input style={inputStyle} ref={(input) => this.input = input}/>
                </AutoComplete>
            </div>;
    }
}
