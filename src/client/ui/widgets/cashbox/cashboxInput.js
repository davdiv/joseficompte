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
import Immutable from "immutable";
import ValueLink from "@validation/valueLink";
import recomputeCashbox from "@validation/cashbox/recompute";
import ShowValidation from "../showValidation";
import CashCountInput from "./cashCountInput";
import DateInput from "../dateInput";
import AmountInput from "../amountInput";
import CashboxHeader from "./cashboxHeader";
import TextInput from "../textInput";

function ItemsTable(props) {
    const itemsArrayLink = props.itemsArrayLink;
    return <div>
        <CashboxHeader title={ props.title } image={ props.image } total={ props.total } />
        { itemsArrayLink.value.map((item, index) => <CashCountInput key={index} valueLink={itemsArrayLink.bind([index, "number"])} unitValue={itemsArrayLink.getIn([index, "unitValue"])} />) }
    </div>;
}

function requestArraySplice (link, args) {
    link.updateIn([], (array) => {
        return array.splice(...args);
    });
}

const defaultCheckLine = Immutable.Map({
    total: 0
});

function ChecksTable(props) {
    // title, image, total, itemsArray
    const itemsArrayLink = props.itemsArrayLink;
    return <div>
               <CashboxHeader title={ props.title } image={ props.image } total={ props.total } />
               <table className="table table-striped table-hover">
               <thead>
                   <tr><th>Banque</th><th>Numéro</th><th>Date</th><th>Montant</th><th></th></tr>
               </thead>
               <tbody>
                   { itemsArrayLink.value.map( (item, index) => {
                       const lineLink = itemsArrayLink.bind([index]);
                       return <tr key={index}>
                           <td><ShowValidation value={lineLink.getIn(["checkBank"])}><TextInput valueLink={lineLink.bind(["checkBank"])} type="text" className="form-control input-sm" /></ShowValidation></td>
                           <td><ShowValidation value={lineLink.getIn(["checkNumber"])}><TextInput valueLink={lineLink.bind(["checkNumber"])} type="text" className="form-control input-sm" /></ShowValidation></td>
                           <td><ShowValidation value={lineLink.getIn(["checkDate"])}><DateInput valueLink={lineLink.bind(["checkDate"])} className="form-control input-sm"/></ShowValidation></td>
                           <td><ShowValidation value={lineLink.getIn(["total"])}><AmountInput valueLink={lineLink.bind(["total"])} className="form-control input-sm"/></ShowValidation></td>
                           <td><button title="Supprimer cette ligne" className="btn btn-default btn-sm" onClick={requestArraySplice.bind(null, itemsArrayLink, [index, 1])}>
                               <span className="glyphicon glyphicon-minus" />
                           </button></td>
                       </tr>;
                   })}
               </tbody>
               <tfoot>
                   <tr className="active">
                       <td colSpan="5">
                           <button title="Ajouter une ligne" className="btn btn-default btn-sm" onClick={requestArraySplice.bind(null, itemsArrayLink, [itemsArrayLink.value.size, 0, defaultCheckLine])}>
                               <span className="glyphicon glyphicon-plus" />
                           </button>
                       </td>
                   </tr>
               </tfoot>
               </table>
           </div>;
}

export default (props) => {
    const valueLink = ValueLink.wrapValidator(props.valueLink, recomputeCashbox);
    return <div className="row">
        <div className="col-md-4">
            <ItemsTable title="Billets" image="banknotes" total={ valueLink.getIn(["total", "banknotes"]) } itemsArrayLink={ valueLink.bind(["banknotes"]) } />
        </div>
        <div className="col-md-4">
            <ItemsTable title="Pièces" image="coins" total={ valueLink.getIn(["total", "coins"]) } itemsArrayLink={ valueLink.bind(["coins"]) } />
        </div>
        <div className="col-md-4">
            <ChecksTable title="Chèques" image="checks" total={ valueLink.getIn(["total", "checks"]) } itemsArrayLink={ valueLink.bind(["checks"]) } />
        </div>
    </div>;
};
