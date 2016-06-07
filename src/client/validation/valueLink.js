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
import {wrapValidator, unwrapValue} from "./errorValue";

const identity = (a) => a;
const noop = () => {};

const defaultValueLink = {
    requestChange: noop
};

export default class ValueLink {
    static wrap(valueLink) {
        return valueLink instanceof ValueLink ? valueLink : new ValueLink(valueLink);
    }

    static wrapValidator(valueLink, validator, defaultValue) {
        validator = validator || identity;
        return new ValueLink(valueLink, unwrapValue(defaultValue), wrapValidator(validator));
    }

    constructor (valueLink, transformIn, transformOut) {
        valueLink = valueLink || defaultValueLink;
        this.parentValueLink = valueLink;
        this.value = (transformIn || identity)(valueLink.value);
        this.transformOut = transformOut;
    }

    requestChange (newValue) {
        const transformOut = this.transformOut || identity;
        this.parentValueLink.requestChange(transformOut(newValue));
    }

    bind (path, defaultValue) {
        return new ValueLink(this, topValue => topValue ? topValue.getIn(path, defaultValue) : defaultValue, bottomValue => (this.value || Immutable.Map()).setIn(path, bottomValue));
    }

    transform (transformIn, transformOut) {
        return new ValueLink(this, transformIn, transformOut);
    }

    updateIn (path, fn) {
        this.requestChange((this.value || Immutable.Map()).updateIn(path, fn));
    }

    setIn (path, value) {
        this.requestChange((this.value || Immutable.Map()).setIn(path, value));
    }

    getIn (path, defaultValue) {
        return this.value ? this.value.getIn(path, defaultValue) : defaultValue;
    }

    mapBind (path, fn) {
        return this.map(path, (item, index, array) => fn(this.bind(path.concat(index)), index, array));
    }

    map (path, fn) {
        return this.getIn(path, Immutable.List()).map(fn);
    }
}
