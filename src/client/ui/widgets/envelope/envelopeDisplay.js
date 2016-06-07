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
import {formatDate, formatDayOfWeek} from "../../formatting/date";
import CashboxDisplay from "@widgets/cashbox/cashboxDisplay";

const boldStyle = {
    fontWeight: "bold"
};

const normalStyle = {};

export default function ({value}) {
    const countedAmount = value.get("countedAmount");
    const countedAmountDetails = value.get("countedAmountDetails");

    const tableLines = [];

    const addLine = function(title, firstPart, amount) {
        tableLines.push(<tr key={tableLines.length}>
            <td style={title ? boldStyle : normalStyle}>{firstPart}</td>
            <td style={title ? boldStyle : normalStyle} className="text-right">{formatAmount(amount)}</td>
        </tr>);
    };

    value.get("days").forEach((day) => {
        addLine(true, <span><span className="glyphicon glyphicon-chevron-right"/> {formatDayOfWeek(day.get("date"))} {formatDate(day.get("date"))}</span>, day.get("sumAmount"));
        day.get("lines").forEach((line) => {
            addLine(false, line.get("details"), line.get("amount"));
        });
    });
    addLine(true, <span><span className="glyphicon glyphicon-chevron-right"/> Montant réel</span>, countedAmount);
    addLine(true, <span><span className="glyphicon glyphicon-chevron-right"/> Somme</span>, value.get("sumAmount"));
    addLine(false, <span><span className="glyphicon glyphicon-chevron-right"/> Différence {value.get("difference") == 0 ? <span className="glyphicon glyphicon-ok-sign"/> : null}</span>, value.get("difference"));
    return <div>
        <div className="panel panel-default">
            <div className="panel-heading"><h4 className="panel-title">Comptes</h4></div>
            <table className="table table-striped">
                <tbody>
                    {tableLines}
                </tbody>
            </table>
            { value.get("comments") ?
                <div className="panel-footer">{value.get("comments")}</div>
            : null }
        </div>

        { countedAmountDetails ?
            <div className="panel panel-default">
                <div className="panel-heading"><h4 className="panel-title">Détails du montant réel: {formatAmount(countedAmountDetails.getIn(["total","total","total"]))}</h4></div>
                <div className="panel-body">
                    <CashboxDisplay value={countedAmountDetails}/>
                </div>
            </div>
        : null }

    </div>;
}
