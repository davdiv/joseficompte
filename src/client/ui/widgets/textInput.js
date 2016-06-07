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
import {ErrorValue} from "@validation/errorValue";

export default class extends React.Component {

    format (value) {
        if (!(typeof value === "string")) {
            return "";
        }
        return value;
    }

    parse (entry) {
        if (!entry) {
            return null;
        }
        return entry;
    }

    is (value1, value2) {
        return Immutable.is(value1, value2);
    }

    callFormat (value) {
        if (value instanceof ErrorValue) {
            return value.entry;
        } else {
            return this.format(value);
        }
    }

    componentWillMount () {
        const value = this.props.valueLink.value;
        this.requestedState = {
            entry: this.callFormat(value),
            value: value
        };
        this.setState(this.requestedState);
    }

    componentDidMount () {
        if (React.firstClientRender) {
            // In case this is the first client render, it is possible that a field is modified
            // before events listeners are installed on the field.
            // For example, a password manager can fill the login form automatically very quickly
            // it is better not to loose the value in that case:
            const input = this._input;
            const entry = input ? input.value : null;
            if (input && entry !== this.state.entry) {
                setTimeout(() => this.onChange(entry), 1);
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        const nextValue = nextProps.valueLink.value;
        const requestedState = this.requestedState;
        if (this.is(nextValue, this.requestedState.value)) {
            this.setState(requestedState);
        } else {
            this.setState({
                entry: this.callFormat(nextValue),
                value: nextValue
            });
        }
    }

    onBlur () {
        const state = this.state;
        const requestedState = this.requestedState = {
            value: state.value,
            entry: this.callFormat(state.value)
        };
        this.setState(requestedState);
    }

    onChange (newEntry) {
        let newValue;
        try {
            newValue = this.parse(newEntry);
            const validator = this.props.validator;
            if (validator) {
                newValue = validator(newValue);
            }
        } catch (e) {
            newValue = new ErrorValue(newEntry, e);
        }
        this.requestChange(newValue, newEntry);
    }

    requestChange(newValue, newEntry) {
        this.requestedState = {
            value: newValue,
            entry: newEntry
        };
        this.props.valueLink.requestChange(newValue);
    }

    computeInputProps() {
        const props = this.props;
        const inputProps = Object.assign({}, props);
        if (inputProps.type === "textarea") {
            delete inputProps.type;
        }
        delete inputProps.validator;
        delete inputProps.valueLink;
        inputProps.value = this.state.entry;
        inputProps.onBlur = () => this.onBlur();
        inputProps.onChange = ({target}) => this.onChange(target.value);
        inputProps.ref = (ref) => this._input = ref;
        return inputProps;
    }

    render () {
        const {type} = this.props;
        if (type == "textarea") {
            return <textarea {...this.computeInputProps()}/>;
        } else {
            return <input {...this.computeInputProps()}/>;
        }
    }
}
