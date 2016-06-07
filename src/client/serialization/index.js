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
import {ErrorValue} from "@validation/errorValue";
const jsonStringify = JSON.stringify;
const jsonParse = JSON.parse;

// so that the value is the object in the replacer:
Date.prototype.toJSON = null;

const createDate = function(value) {
    return new Date(value.$date);
};

const getDateReplacement = function(value) {
    return {
        $date: value.getTime()
    };
};

const copy = function(src, dst) {
    Object.keys(src).forEach(function(key) {
        dst[key] = src[key];
    });
};

const createError = function(value) {
    const res = new Error();
    copy(value.$error, res);
    return res;
};

const getErrorReplacement = function(error) {
    const errorCopy = {
        name: error.name,
        message: error.message
    };
    copy(error, errorCopy);
    return {
        $error: errorCopy
    };
};

const createErrorValue = function (value) {
    const errorValue = value.$errorValue;
    return new ErrorValue(errorValue.entry, errorValue.error);
};

const getErrorValueReplacement = function(value) {
    return {
        $errorValue: {
            entry: value.entry,
            error: value.error
        }
    };
};

export function replacer(key, value) {
    if (value instanceof Date) {
        return getDateReplacement(value);
    }
    if (value instanceof Error) {
        return getErrorReplacement(value);
    }
    if (value instanceof ErrorValue) {
        return getErrorValueReplacement(value);
    }
    return value;
}

export function reviver(key, value) {
    if (value && value.$date) {
        return createDate(value);
    }
    if (value && value.$error) {
        return createError(value);
    }
    if (value && value.$errorValue) {
        return createErrorValue(value);
    }
    return value;
}

export function stringify(object) {
    return jsonStringify(object, replacer);
}

export function parse(string) {
    return Immutable.fromJS(jsonParse(string, reviver));
}
