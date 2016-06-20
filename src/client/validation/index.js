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
import deleteValue from "@validation/deleteValue";

const errorMessage = "Erreur de validation. Veuillez vérifier que les champs sont correctement remplis.";

export function validationFailurePrependPath(validationFailure, path) {
    if (path != null && !Array.isArray(path)) {
        path = [path];
    }
    if (path == null || path.length == 0) {
        return;
    }
    validationFailure.errors.forEach(function(error) {
        error.path = path.concat(error.path);
    });
}

const validationFailureDetails = function(validationFailure) {
    const res = ["ValidationFailure:\n"];
    validationFailure.errors.forEach(function(error) {
        res.push(" - in ", ["<root>"].concat(error.path).join("."), ": ", error.id, " ", error.args, "\n");
    });
    return res.join("");
};

const validationFailures = function(array) {
    const res = new Error(errorMessage);
    res.name = "ValidationFailure";
    if (array.length == 1) {
        res.errors = array[0].errors;
    } else {
        const errors = [];
        array.forEach(function(err) {
            errors.push.apply(errors, err.errors);
        });
        res.errors = errors;
    }
    res.expose = true;
    res.status = 400;
    res.toString = validationFailureDetails.bind(null, res);
    return res;
};

export function validationFailure(id, args, path) {
    const res = new Error(errorMessage);
    res.name = "ValidationFailure";
    res.errors = [{
        id: id,
        args: args || null,
        path: path ? path.slice(0) : []
    }];
    res.expose = true;
    res.status = 400;
    res.toString = validationFailureDetails.bind(null, res);
    return res;
}

export function isValidationFailure(error) {
    return error instanceof Error && error.name == "ValidationFailure" && error.errors;
}

const arrayToKeys = function(array) {
    const res = Object.create(null);
    array.forEach(function(key) {
        res[key] = 1;
    });
    return res;
};

export function validator(validators) {
    if (typeof validators == "function") {
        return validators;
    } else if (Array.isArray(validators)) {
        return function(value) {
            validators.forEach(function(fn) {
                value = fn(value);
            });
            return value;
        };
    }

}

export function inPath(path, config) {
    const itemValidator = validator(config);
    return function(value) {
        try {
            return itemValidator(value);
        } catch (e) {
            if (isValidationFailure(e)) {
                validationFailurePrependPath(e, path);
            }
            throw e;
        }
    };
}

export function object(config) {
    const configKeys = Object.keys(config);
    return function(value) {
        if (!Immutable.Map.isMap(value)) {
            throw validationFailure("object");
        }
        const errors = [];
        let newObject = value;
        let remainingProperties = arrayToKeys(value.keySeq().toJS());
        configKeys.forEach(function(key) {
            try {
                const newValue = validator(config[key])(value.get(key));
                if (newValue === deleteValue) {
                    newObject = newObject.delete(key);
                } else {
                    newObject = newObject.set(key, newValue);
                }
            } catch (e) {
                if (!isValidationFailure(e)) {
                    throw e;
                }
                validationFailurePrependPath(e, key);
                errors.push(e);
            }
            delete remainingProperties[key];
        });
        remainingProperties = Object.keys(remainingProperties);
        if (remainingProperties.length > 0) {
            errors.push(validationFailure("object.extra-properties", [remainingProperties]));
        }
        if (errors.length > 0) {
            throw validationFailures(errors);
        }
        return newObject;
    };
}

const iterable = function(checkFunction, failureId) {
    return function (config) {
        const itemValidator = validator(config);
        return function(value) {
            if (!checkFunction(value)) {
                throw validationFailure(failureId);
            }
            const errors = [];
            const newArray = value.map(function(curValue, curIndex) {
                try {
                    return itemValidator(curValue);
                } catch (e) {
                    if (!isValidationFailure(e)) {
                        throw e;
                    }
                    validationFailurePrependPath(e, curIndex);
                    errors.push(e);
                }
            });
            if (errors.length > 0) {
                throw validationFailures(errors);
            }
            return newArray;
        };
    };
};

export const array = iterable(Immutable.List.isList, "array");

export const map = iterable(Immutable.Map.isMap, "map");

export function minLength(minLength) {
    return function(value) {
        if (value.length < minLength) {
            throw validationFailure("minLength");
        }
        return value;
    };
}

export function maxLength(maxLength) {
    return function(value) {
        if (value.length > maxLength) {
            throw validationFailure("maxLength");
        }
        return value;
    };
}

export function minSize(minSize) {
    return function(value) {
        if (value.size < minSize) {
            throw validationFailure("minSize");
        }
        return value;
    };
}

export function string(value) {
    if (typeof value !== "string") {
        throw validationFailure("string");
    }
    return value;
}

export function number(value) {
    if (typeof value !== "number") {
        throw validationFailure("number");
    }
    return value;
}

export function integer(value) {
    if (typeof value !== "number" || Math.floor(value) !== value) {
        throw validationFailure("integer");
    }
    return value;
}

export function minValue(minValue) {
    return function(value) {
        if (value < minValue) {
            throw validationFailure("minValue");
        }
        return value;
    };
}

export function date(value) {
    if (!(value instanceof Date)) {
        throw validationFailure("date");
    }
    return value;
}

export function boolean(value) {
    return !!value;
}

export function pastDate(value) {
    if (!(value instanceof Date) || value.getTime() > Date.now()) {
        throw validationFailure("pastDate");
    }
    return value;
}

export function defaultValue(defValue) {
    return function(value) {
        return value == null ? Immutable.fromJS(defValue) : value;
    };
}

export function optional(config) {
    const itemValidator = validator(config);
    return function(value) {
        if (value != null) {
            return itemValidator(value);
        }
        return deleteValue;
    };
}

export function enumValue(values) {
    if (Array.isArray(values)) {
        values = arrayToKeys(values);
    }
    return function(value) {
        if (typeof value != "string" || values[value] == null) {
            throw validationFailure("enumValue");
        }
        return value;
    };
}

export function regExp(re) {
    return function(value) {
        if (typeof value != "string" || !re.test(value)) {
            throw validationFailure("regExp", re.source);
        }
        return value;
    };
}

const idRegExp = /^[0-9a-f]{24}$/;
export const id = regExp(idRegExp);
