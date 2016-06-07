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
import generateSecureId from "../../generateSecureId";
import {object} from "@validation";
import email from "@validation/email";
import {generateEmail} from "./emailTemplate";
import constantTime from "../../constantTime";
import limitAuthenticationFailures from "../../limitAuthenticationFailures";

const expectedBody = object({
    email: email
});

const emailTimeout = 30 * 60 * 1000; // 30 min (in milliseconds)
const maxValidResetPasswordEmails = 10;
const sendEmailTime = 5000; // 5s

export default async (ctx) => {
    const config = ctx.application.config;
    await constantTime(sendEmailTime, async () => {
        const currentDate = new Date();
        let email, user;

        // limits the number of valid password reset links per ip address:
        const resetPasswordEmailsCount = await config.database.collection("resetPasswordEmails").count({
            ip: ctx.ip,
            enabled: true,
            expirationDate: {
                $gte: new Date(currentDate)
            }
        }, {
            limit: maxValidResetPasswordEmails
        });
        if (resetPasswordEmailsCount >= maxValidResetPasswordEmails) {
            return;
        }

        try {
            await limitAuthenticationFailures(ctx, async () => {
                const data = await ctx.readJsonBody(expectedBody);
                email = data.get("email");
                user = await config.database.collection("users").find({
                    "revision.current": true,
                    "keys.email": email
                }).limit(1).next();

                if (!user || !user.revision.content) {
                    throw new Error();
                }
            });
        } catch (e) {
            // fails silently
            return;
        }

        const userInfo = user.revision.content;
        const subject = `Réinitialisation de votre mot de passe ${url.parse(config.address).hostname}`;
        const expirationDate = new Date(currentDate.getTime() + emailTimeout);
        const id = await generateSecureId();
        const emailInfo = {
            _id: id,
            ip: ctx.ip,
            userAgent: ctx.get("User-Agent"),
            date: currentDate,
            email: email,
            enabled: true,
            expirationDate: expirationDate,
            userId: user._id,
            userDisplayName: userInfo.displayName
        };
        await config.mailTransport.sendMail(Object.assign({
            from: config.mailSender,
            to: {
                name: userInfo.displayName,
                address: email
            },
            subject: subject,
            date: currentDate
        }, generateEmail(ctx.application, emailInfo)));
        await config.database.collection("resetPasswordEmails").insertOne(emailInfo);
    });
    ctx.body = {};
};
