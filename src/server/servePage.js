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

import helmet from "koa-helmet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Immutable from "immutable";
import Root from "@client/ui/root";
import createServerCallApi from "./api/createServerCallApi";
import sessionInfo from "./api/login/sessionInfo";
import createStore from "@client/state/createStore";
import navigate from "@client/state/actions/navigate";
import setValue from "@client/state/actions/setValue";
import { stringify } from "@client/serialization";
import generateSecureId from "./api/login/generateSecureId";

// Note: the following manifest path is relative to build/server/main.js:
import staticsManifest from "../public/statics/manifest.json";

const safeStringify = function(data) {
    return JSON.stringify(data).replace(/<\/script/g, "<\\/script").replace(/<!--/g, "<\\!--");
};

const htmlStyle = {
    position: "relative",
    minHeight: "100%",
    paddingBottom: "60px"
};

const csp = helmet.contentSecurityPolicy({
    directives: {
        baseUri: ["'none'"],
        connectSrc: [({ctx}) => `${ctx.host}/api/`],
        defaultSrc: ["'none'"],
        fontSrc: [({ctx}) => `${ctx.host}/statics/`],
        formAction: [({ctx}) => `${ctx.host}/form`],
        frameAncestors: ["'none'"],
        imgSrc: [({ctx}) => `${ctx.host}/statics/`, ({ctx}) => `${ctx.host}/favicon.ico`],
        scriptSrc: [({ctx}) => `${ctx.host}/statics/`, ({ctx}) => `'nonce-${ctx.nonce}'`],
        styleSrc: [({ctx}) => `${ctx.host}/statics/`, "'unsafe-inline'"]
    }
});

export default async function (ctx) {
    const store = createStore(createServerCallApi(ctx));
    if (ctx.session) {
        await store.dispatch(setValue(["session"], Immutable.fromJS(sessionInfo(ctx.session))));
    }
    await store.dispatch(navigate(ctx.path, ctx.search));
    const storeState = store.getState();
    ctx.set("Cache-Control", "no-cache, no-store");
    ctx.status = storeState.getIn(["route", "status"]);
    const path = storeState.getIn(["route", "path"]);
    const search = storeState.getIn(["route", "search"]);
    if (path !== ctx.path || search !== ctx.search) {
        ctx.redirect(`${path}${search}`);
    } else {
        ctx.nonce = await generateSecureId();
        await csp(ctx);
        const html = <html style={htmlStyle}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{ storeState.getIn(["route", "title"]) }</title>
                <link rel="stylesheet" href={`/statics/${staticsManifest["main.css"]}`} />
            </head>
            <body>
                <div dangerouslySetInnerHTML={
                    {__html: ReactDOMServer.renderToString(<Root store={store} />)}
                } />
                <noscript>
                    <style dangerouslySetInnerHTML={
                        {__html: "body>div{display:none;}noscript{margin:30px;}"}
                    }/>
                    <div className="container-fluid">
                        <div className="alert alert-danger">
                            <span className="glyphicon glyphicon-info-sign"/> JavaScript est désactivé ou non supporté dans votre navigateur.
                            Vous devez utiliser un navigateur avec JavaScript activé pour pouvoir accéder à cette application.
                        </div>
                    </div>
                </noscript>
                <script src={`/statics/${staticsManifest["main.js"]}`} />
                <script dangerouslySetInnerHTML={
                    {__html: `app(${safeStringify(stringify(storeState))}, document.body.firstChild);`}
                } nonce={ctx.nonce}/>
            </body>
        </html>;
        ctx.body = `<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(html)}`;
    }
}
