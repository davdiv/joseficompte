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

import pathToRegexp from "path-to-regexp";

const cache = Object.create(null);

function match(pattern, path, end) {
    const cacheKey = `${pattern},${!!end}`;
    let entry = cache[cacheKey];
    if (!entry) {
        const keys = [];
        entry = cache[cacheKey] = { re: pathToRegexp(pattern, keys, {end}), keys };
    }
    const matchRes = entry.re.exec(path);
    if (!matchRes) {
        return null;
    }
    const keys = entry.keys;
    const params = Object.create(null);
    for (let i = 0, l = keys.length; i < l; i++) {
        params[keys[i].name] = matchRes[i+1];
    }
    return {params, path: matchRes[0]};
}

function * iterateRoutes(routes, path) {
    for (const route of routes) {
        const children = route.children;
        const matchInfo = match(route.path, path, !children);
        if (matchInfo) {
            yield { route, params: matchInfo.params };
            if (children) {
                const newPath = path.slice(matchInfo.path.length);
                yield* iterateRoutes(children, newPath);
            }
        }
    }
}

const defaultActionsGetter = (route) => route.actions;

function * iterateMiddlewares(routes, path, actionsGetter) {
    const iterator = iterateRoutes(routes, path);
    let {value, done} = iterator.next();
    while (!done) {
        const {route, params} = value;
        const actions = (actionsGetter || defaultActionsGetter)(route);
        if (Array.isArray(actions)) {
            for (const action of actions) {
                yield {action, params};
            }
        }
        ({value, done} = iterator.next());
    }
}

function callOnce (f) {
    return () => {
        const fn = f;
        f = null;
        if (fn) {
            return fn();
        }
    };
}

export async function asyncRouter(routes, ctx, actionsGetter) {
    const iterator = iterateMiddlewares(routes, ctx.path, actionsGetter);

    async function next() {
        const {value, done} = iterator.next();
        if (!done) {
            const initialParams = ctx.params;
            try {
                ctx.params = value.params;
                const action = value.action;
                await action(ctx, callOnce(next));
            } finally {
                ctx.params = initialParams;
            }
        }
    }

    await next();
}

/*
export function syncRouter(routes, ctx, actionsGetter) {
    const iterator = iterateMiddlewares(routes, ctx.path, actionsGetter);

    function next() {
        const {value, done} = iterator.next();
        if (!done) {
            const initialParams = ctx.params;
            try {
                ctx.params = value.params;
                const action = value.action;
                action(ctx, callOnce(next));
            } finally {
                ctx.params = initialParams;
            }
        }
    }

    next();
}
*/
