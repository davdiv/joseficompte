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
import ReactDOMServer from "react-dom/server";
import {stringify as stringifyQuery} from "query-string";
import {formatTimestamp} from "@client/ui/formatting/date";
import Timestamp from "@widgets/timestamp";
import appInfo from "@client/appInfo";

export const generateEmail = ({config}, {userDisplayName, expirationDate, _id}) => {
    const connectLink = generateLink({config}, _id);
    return {
        text: `Cher(e) ${userDisplayName},

Suite à votre demande, nous vous envoyons ci-dessous dans ce courriel un lien pour réinitialiser votre mot de passe pour l'application ${appInfo.title}.
Si vous avez reçu ce courriel sans avoir demandé à réinitialiser votre mot de passe, veuillez simplement le supprimer.
Veillez à ne transmettre ce courriel à personne, sous aucun prétexte.

Lien: ${connectLink}

Vous pouvez simplement cliquer sur ce lien, ou bien vous pouvez le copier/coller dans votre navigateur.

Pour des raisons de sécurité, vous devez ouvrir le lien dans le même navigateur et sur le même ordinateur que votre demande de réinitialisation de mot de passe. De plus, le lien ne peut être utilisé qu'une seule fois, et expirera à la date suivante:

Date d'expiration: ${formatTimestamp(expirationDate)}

Afin d'éviter que ce courriel ne puisse être lu par des personnes non autorisées, merci de le supprimer dès que possible, et de vider les éléments supprimés.

Nous vous souhaitons une excellente utilisation de l'application ${appInfo.title}.
`,
        html: `<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(
        <html>
            <body>
                <p>Cher(e) {userDisplayName},</p>
                <p>Suite à votre demande, nous vous envoyons ci-dessous dans ce courriel un lien pour réinitialiser votre mot de passe pour l'application <b>{appInfo.title}</b>.</p>
                <p>Si vous avez reçu ce courriel sans avoir demandé à réinitialiser votre mot de passe, veuillez simplement le supprimer.</p>
                <p><b>Veillez à ne transmettre ce courriel à personne, sous aucun prétexte.</b></p>
                <p>Lien: <a href={connectLink}>{connectLink}</a></p>
                <p>Vous pouvez simplement cliquer sur le lien, ou bien vous pouvez le copier/coller dans votre navigateur.</p>
                <p>Pour des raisons de sécurité, vous devez ouvrir le lien dans le même navigateur et sur le même ordinateur que votre demande de réinitialisation de mot de passe. De plus, le lien ne peut être utilisé qu'une seule fois, et expirera à la date suivante:</p>
                <p>Date d'expiration: <b><Timestamp value={expirationDate}/></b></p>
                <p><b>Afin d'éviter que ce courriel ne puisse être lu par des personnes non autorisées, merci de le supprimer dès que possible, et de vider les éléments supprimés.</b></p>
                <p>Nous vous souhaitons une excellente utilisation de l'application {appInfo.title}.</p>
            </body>
        </html>)}`
    };
};

export const generateLink = ({config}, id) => `${config.address}/r?${stringifyQuery({id})}`;
