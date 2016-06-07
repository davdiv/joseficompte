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
import formatAmount from "../../formatting/amount";
import "./cashbox.css";

const blockStyle = {
    minWidth: "150px",
    display: "inline-block",
    textAlign: "left",
    verticalAlign: "middle"
};
const tableStyle = {
    marginBottom: "20px",
    width: "100%"
};

export default (props) => <div>
    <div className={`img-responsive cashbox-${props.image}`} />
        <div style={ blockStyle }>
            <h2>{ props.title }</h2>
            <table style={ tableStyle }>
                <tbody>
                    <tr>
                        <th>Nombre</th>
                        <td>
                            { props.total.get("number") }
                        </td>
                    </tr>
                    <tr>
                        <th>Montant</th>
                        <td>
                            { formatAmount(props.total.get("total")) }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>;
