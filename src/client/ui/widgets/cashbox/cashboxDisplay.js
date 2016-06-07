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
import CashboxHeader from "./cashboxHeader";
import formatAmount from "../../formatting/amount";
import {formatDate} from "../../formatting/date";

const formatNumber = function(value) {
    if (typeof value === "number" && !isNaN(value)) {
        return String(value);
    }
};

const ItemsTable = (props) => <div>
    <CashboxHeader title={ props.title } image={ props.image } total={ props.total } />
    { props.total.get("number") > 0 ?
    <table className="table table-striped table-hover">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>
                    { props.title }
                </th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            { props.itemsArray.map(function(item, index) {
                const number = item.get("number");
                if (number !== 0) {
                    return <tr key={ index }>
                        <td>
                            { formatNumber(number) }
                        </td>
                        <td>
                            { formatAmount(item.get("unitValue")) }
                        </td>
                        <td>
                            { formatAmount(item.get("number") * item.get("unitValue")) }
                        </td>
                    </tr>;
                }
            }) }
        </tbody>
    </table> : null }
</div>;

const ChecksTable = (props) => <div>
        <CashboxHeader title={ props.title } image={ props.image } total={ props.total } />
            { props.total.get("number") > 0 ?
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Banque</th>
                        <th>Numéro</th>
                        <th>Date</th>
                        <th>Montant</th>
                    </tr>
                </thead>
            <tbody>
                { props.itemsArray.map((item, index) => <tr key={ index }>
                        <td>
                            { item.get("checkBank") }
                        </td>
                        <td>
                            { item.get("checkNumber") }
                        </td>
                        <td>
                            { formatDate(item.get("checkDate")) }
                        </td>
                        <td>
                            { formatAmount(item.get("total")) }
                        </td>
                    </tr>)}
             </tbody>
         </table>
        : null }
    </div>;

export default ({value}) => {
    return <div className="row">
       <div className="col-md-4">
           <ItemsTable title="Billets" image="banknotes" total={ value.getIn(["total", "banknotes"]) } itemsArray={ value.get("banknotes") } />
       </div>
       <div className="col-md-4">
           <ItemsTable title="Pièces" image="coins" total={ value.getIn(["total", "coins"]) } itemsArray={ value.get("coins") } />
       </div>
       <div className="col-md-4">
           <ChecksTable title="Chèques" image="checks" total={ value.getIn(["total", "checks"]) } itemsArray={ value.get("checks") } />
       </div>
   </div>;
};
