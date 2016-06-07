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

import {ObjectId} from "mongodb";
import {object, id, optional, integer} from "@validation";
import checkMethod from "../checkMethod";

const checkUserRole = (ctx, role) => {
    const session = ctx.session;
    if (!session || (role && session.userRoles.indexOf(role) === -1)) {
        ctx.throw(403, "Accès interdit.");
    }
};

const createRevision = (ctx, newObject, documentId) => ({
    current: true,
    documentId: documentId,
    revisionId: (new ObjectId()).toHexString(),
    date: new Date(),
    userId: ctx.session.userId,
    content: newObject.toJSON()
});

const defaultComputeKeys = () => ({});

export default ({collectionName, validator, path, writeRole, readRole, readHistoryRole = readRole, maxReturnedItems = 200, computeKeys = defaultComputeKeys}) => {
    const queryDatabase = async (ctx, queryObject) => {
        const skipCount = integer(ctx.query.skip || 0);
        const cursor = ctx.application.config.database.collection(collectionName).
            find(queryObject).
            skip(skipCount).
            limit(maxReturnedItems);
        const result = await cursor.toArray();
        ctx.body = result.map(doc => doc.revision);
    };

    const newRevisionValidator = object({
        lastRevisionId: id,
        // setting a null content means deleting the document
        content: optional(validator)
    });
    return {
        path: path,
        children: [
            {
                path: "/",
                actions: [checkMethod({
                    // list objects
                    GET: async (ctx) => {
                        checkUserRole(ctx, readRole);
                        await queryDatabase(ctx, {
                            "revision.current": true
                        });
                    },
                    // add a new object
                    POST: async (ctx) => {
                        checkUserRole(ctx, writeRole);
                        const newObject = await ctx.readJsonBody(validator);
                        const documentId = (new ObjectId()).toHexString();
                        const keys = computeKeys(newObject);
                        const revision = createRevision(ctx, newObject, documentId);
                        await ctx.application.config.database.collection(collectionName).insertOne({
                            _id: documentId,
                            revision: revision,
                            keys: keys
                        });
                        ctx.body = revision;
                    }
                })]
            },
            {
                path: "/:documentId",
                actions: [checkMethod({
                    // list revisions
                    GET: async (ctx) => {
                        checkUserRole(ctx, readHistoryRole);
                        const documentId = id(ctx.params.documentId);
                        await queryDatabase(ctx, {
                            "revision.documentId": documentId
                        });
                    },
                    // post a new revision
                    POST: async (ctx) => {
                        checkUserRole(ctx, writeRole);
                        const documentId = id(ctx.params.documentId);
                        const jsonBody = await ctx.readJsonBody(newRevisionValidator);
                        const keys = computeKeys(jsonBody.get("content"));
                        const newRevision = createRevision(ctx, jsonBody.get("content"), documentId);
                        const {value: oldDocument} = await ctx.application.config.database.collection(collectionName).findOneAndReplace({
                            _id: documentId,
                            "revision.current": true,
                            "revision.documentId": documentId,
                            "revision.revisionId": jsonBody.get("lastRevisionId")
                        }, {
                            _id: documentId,
                            revision: newRevision,
                            keys: keys
                        }, {
                            returnOriginal: true
                        });
                        if (!oldDocument) {
                            ctx.throw(400, "Votre modification n'a pu être prise en compte maintenant. Il est possible que le document ait été modifié par quelqu'un d'autre en même temps.");
                        }
                        // keep the old revision in a new record:
                        const oldRevision = oldDocument.revision;
                        oldRevision.current = false;
                        await ctx.application.config.database.collection(collectionName).insertOne({
                            _id: oldRevision.revisionId,
                            revision: oldRevision
                            // we do not include keys of older documents
                        });
                        ctx.body = newRevision;
                    }
                })]
            },
            {
                path: "/:documentId/:revisionId",
                actions: [checkMethod({
                    GET: async (ctx) => {
                        const documentId = id(ctx.params.documentId);
                        let queryObject = null;
                        const revisionId = ctx.params.revisionId;
                        if (revisionId === "latest") {
                            checkUserRole(ctx, readRole);
                            queryObject = {
                                "_id": documentId,
                                "revision.documentId": documentId,
                                "revision.current": true
                            };
                        } else {
                            checkUserRole(ctx, readHistoryRole);
                            queryObject = {
                                "revision.documentId": documentId,
                                "revision.revisionId": id(revisionId)
                            };
                        }
                        const document = await ctx.application.config.database.collection(collectionName).findOne(queryObject);
                        if (!document) {
                            ctx.throw(404, "Le document demandé n'a pas été trouvé.");
                        }
                        ctx.body = document.revision;
                    }
                })]
            }
        ]
    };
};
