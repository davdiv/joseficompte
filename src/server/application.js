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

import url from "url";
import path from "path";
import Koa from "koa";
import helmet from "koa-helmet";
import send from "koa-send";
import favicon from "koa-favicon";
import {asyncRouter} from "@client/router";
import clientCallApi from "./api/clientCallApi";
import readSession from "./api/login/readSession";
import servePage from "./servePage";
import checkMethod from "./checkMethod";

const hasHash = /[0-9a-f]{32}/;
const staticsRoot = path.join(__dirname, "..", "public");
const sendStatic = async (ctx) => await send(ctx, ctx.path, {
    root: staticsRoot,
    setHeaders: (res, filePath) => {
        const fileBaseName = path.basename(filePath);
        const enableCache = hasHash.test(fileBaseName);
        res.setHeader("Cache-Control", enableCache ? "public, max-age=31536000" : "no-cache, no-store");
    }
});
const sendRobotsTxt = async (ctx) => ctx.body = "User-agent: *\nDisallow: /\n";
const sendBlankPage = async (ctx) => ctx.body = "";

const checkAddress = (address) => {
    const parsedAddress = url.parse(address);
    const expectedProtocol = parsedAddress.protocol.replace(/:$/, "");
    const expectedHost = parsedAddress.host;
    return async (ctx, next) => {
        if (ctx.protocol !== expectedProtocol || ctx.host !== expectedHost) {
            ctx.redirect(url.format({
                protocol: expectedProtocol,
                host: expectedHost,
                pathname: ctx.path,
                search: ctx.search
            }));
        } else {
            await next();
        }
    };
};

const routes = [
    {
        path: "/api/*",
        actions: [readSession, clientCallApi]
    },
    {
        path: "/statics/*",
        actions: [checkMethod({GET: sendStatic})]
    },
    {
        path: "/robots.txt",
        actions: [checkMethod({GET: sendRobotsTxt})]
    },
    {
        path: "/form",
        actions: [sendBlankPage]
    },
    {
        path: "/debug",
        children: process.env.NODE_ENV === "development" ? require("./debugRoutes").default : []
    },
    {
        path: "/*",
        actions: [readSession, checkMethod({GET: servePage})]
    }
];

export default class {
    constructor() {
        this.koaApp = null;
    }

    async init(config) {
        this.config = config;
        const koaApp = this.koaApp = new Koa();

        koaApp.proxy = !! config.trustProxy;
        console.log(`Application ${koaApp.proxy ? "IS" : "is NOT"} behind a proxy.`);

        koaApp.use(checkAddress(config.address));
        koaApp.use(favicon(path.join(__dirname, "..", "..", "favicon.ico")));
        koaApp.use(helmet());
        koaApp.use(helmet.frameguard({
            action: "deny"
        }));
        koaApp.use(async (ctx) => {
            ctx.application = this;
            ctx.req.ctx = ctx;
            await asyncRouter(routes, ctx);
        });
    }

    attachTo(httpServer) {
        httpServer.on("request", this.koaApp.callback());
    }
}
