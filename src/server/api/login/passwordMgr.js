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

import crypto from "crypto";
import promisify from "pify";

const pbkdf2 = promisify(crypto.pbkdf2);
const randomBytes = promisify(crypto.randomBytes);

const defaultIterations = 500000;
const defaultSaltlen = 64;
const defaultKeylen = 64;
const defaultDigest = "sha512";

export async function hashPassword (passwordToHash, {saltlen = defaultSaltlen, iterations = defaultIterations, digest = defaultDigest, keylen = defaultKeylen} = {}) {
    const salt = await randomBytes(saltlen);
    const storedPassword = {
        salt: salt.toString("base64"),
        iterations: iterations,
        keylen: keylen,
        digest: digest
    };
    storedPassword.hash = await computeHash(passwordToHash, storedPassword);
    return storedPassword;
}

export async function computeHash(password, storedPassword) {
    const hash = await pbkdf2(password, new Buffer(storedPassword.salt, "base64"), storedPassword.iterations, storedPassword.keylen, storedPassword.digest);
    return hash.toString("base64");
}

export const checkPassword = async (passwordToCheck, storedPassword) => {
    if (storedPassword) {
        const hash = await computeHash(passwordToCheck, storedPassword);
        if (hash === storedPassword.hash) {
            return;
        }
    }
    throw new Error();
};
