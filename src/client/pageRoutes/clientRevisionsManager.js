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

import * as dynComponents from "@dynComponents";
import pageNotFound from "./pageNotFound";
import requireAuthentication from "./requireAuthentication";
import loadRevision from "@actions/revisionsManager/loadRevision";

export default ({path: docTypePath, displayComponent, editComponent}) => {
    const editAndPreview = [
        {
            path: "/edit",
            actions: [async (ctx) => {
                ctx.extraComponents.push(editComponent);
                ctx.rootComponent = dynComponents.pageRevisionContainer;
                ctx.data.editComponent = editComponent;
            }]
        },
        {
            path: "/preview",
            actions: [async (ctx) => {
                if (ctx.getState().hasIn(["unsavedData", ctx.data.editionHref])) {
                    ctx.extraComponents.push(displayComponent);
                    ctx.rootComponent = dynComponents.pageRevisionContainer;
                    ctx.data.displayComponent = displayComponent;
                } else {
                    await pageNotFound(ctx);
                }
            }]
        }
    ];

    return {
        path: docTypePath,
        actions: [requireAuthentication(), async (ctx, next) => {
            ctx.data.docTypePath = docTypePath;
            ctx.data.curHref = ctx.path;
            await next();
        }],
        children: [
            {
                path: "/new",
                actions: [async (ctx) => {
                    ctx.path = `${docTypePath}/new/${Date.now()}/edit`;
                    ctx.search = "";
                }]
            },
            {
                path: "/new/:newId",
                actions: [async (ctx, next) => {
                    const newId = ctx.params.newId;
                    ctx.data.editionHref = `${docTypePath}/new/${newId}/edit`;
                    ctx.data.previewHref = `${docTypePath}/new/${newId}/preview`;
                    await next();
                }],
                children: editAndPreview
            },
            {
                path: "/:documentId",
                actions: [async (ctx, next) => {
                    const documentId = ctx.params.documentId;
                    ctx.data.documentId = documentId;
                    ctx.data.lastRevisionHref = `${docTypePath}/${documentId}`;
                    ctx.data.editionHref = `${docTypePath}/${documentId}/edit`;
                    ctx.data.previewHref = `${docTypePath}/${documentId}/preview`;
                    await ctx.dispatch(loadRevision({
                        docTypePath: docTypePath,
                        documentId: ctx.params.documentId
                    }));
                    await next();
                }],
                children: [
                    {
                        path: "/",
                        actions: [async (ctx) => {
                            ctx.extraComponents.push(displayComponent);
                            ctx.data.displayComponent = displayComponent;
                            ctx.rootComponent = dynComponents.pageRevisionContainer;
                        }]
                    },
                    ...editAndPreview
                ]
            }
        ]
    };
};
