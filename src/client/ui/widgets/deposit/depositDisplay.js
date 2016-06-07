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

const AmountDetails = ({title, cashbox}) => cashbox ?
    <div className="panel panel-default">
        <div className="panel-heading"><h4 className="panel-title">{title} {formatAmount(cashbox.getIn(["total","total","total"]))}</h4></div>
        <div className="panel-body">
            <CashboxDisplay value={cashbox}/>
        </div>
    </div> : null;

export default function ({value}) {
    const date = value.get("date");
    const refusal = value.get("refusal");
    const depositLabel = refusal ? "Dépôt initialement prévu" : "Dépôt";
    return <div>
        <div className="panel panel-default">
            <div className="panel-heading"><h4 className="panel-title">Informations générales</h4></div>
            <table className="table table-striped">
                <tbody>
                    <tr><td>Date</td><td className="text-right">{formatDayOfWeek(date)} {formatDate(date)}</td></tr>
                    <tr><td>Référence</td><td className="text-right">{value.get("reference")}</td></tr>
                    <tr><td>{ depositLabel }</td><td className="text-right">{formatAmount(value.getIn(["deposit", "amount"]))}</td></tr>
                    { refusal ?
                        <tr><td>Montant refusé ({refusal.get("reason") || "raison non indiquée"})</td><td className="text-right">{formatAmount(refusal.get("amount"))}</td></tr>
                    : null}
                    { refusal ?
                        <tr><td>Total</td><td className="text-right">{formatAmount(value.get("total"))}</td></tr>
                    : null}
                </tbody>
                { value.get("comments") ?
                    <div className="panel-footer">{value.get("comments")}</div>
                : null }
            </table>
        </div>
        <AmountDetails title={depositLabel} cashbox={value.getIn(["deposit", "amountDetails"])}/>
        <AmountDetails title="Montant refusé" cashbox={value.getIn(["refusal", "amountDetails"])}/>
    </div>;
}
