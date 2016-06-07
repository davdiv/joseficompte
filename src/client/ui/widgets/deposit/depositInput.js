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
import DateInput from "../dateInput";
import TextInput from "../textInput";
import AmountInput from "../amountInput";
import formatAmount from "../../formatting/amount";
import {formatDayOfWeek} from "../../formatting/date";
import ShowValidation from "../showValidation";
import ValueLink from "@validation/valueLink";
import defaultCashbox from "@validation/cashbox/default";
import CashboxInput from "../cashbox/cashboxInput";
import recompute from "@validation/deposit/recompute";
import defaultDeposit from "@validation/deposit/default";

const defaultRefusal = Immutable.Map({
    amount: 0,
    amountDetails: defaultCashbox,
    reason: null
});

const AmountLine = ({title, valueLink, addDetails}) => {
    return <ShowValidation className="form-group form-group-sm">
        <label className="col-md-2 control-label">{title}</label>
        { valueLink.getIn(["amountDetails"]) ?
            <div className="col-md-3">
                <p className="form-control-static">{formatAmount(valueLink.getIn(["amount"]))}</p>
            </div>
        :   <div className="col-md-3">
                <div className="input-group input-group-sm">
                    <AmountInput className="form-control" valueLink={valueLink.bind(["amount"])}/>
                    <span className="input-group-btn">
                        <button className="btn btn-default" onClick={addDetails} title="Détailler le montant">
                            <span className="glyphicon glyphicon-list-alt"/>
                        </button>
                    </span>
                </div>
            </div>
        }
    </ShowValidation>;
};

const AmountDetails = ({title, valueLink, remove}) => valueLink.value ?
    <div className="panel panel-default">
        <div className="panel-heading">
            <h4 className="panel-title">{title} {formatAmount(valueLink.getIn(["total","total","total"]))}
                <button className="btn btn-default btn-xs pull-right" onClick={remove}>
                    <span className="glyphicon glyphicon-remove"/>
                </button>
            </h4>
        </div>
        <div className="panel-body">
            <CashboxInput valueLink={valueLink}/>
        </div>
    </div> : null;

export default class extends React.Component {

    removeCashbox(whichOne) {
        const path = [whichOne, "amountDetails"];
        const cashbox = this.valueLink.getIn(path);
        if (cashbox) {
            this[`${whichOne}savedCashbox`] = cashbox;
            this.valueLink.setIn(path, null);
        }
    }

    addCashbox(whichOne) {
        this.valueLink.setIn([whichOne, "amountDetails"], this[`${whichOne}savedCashbox`] || defaultCashbox);
    }

    toggleRefusal() {
        const refusal = this.valueLink.getIn(["refusal"]);
        if (refusal) {
            this.savedRefusal = refusal;
            this.valueLink.setIn(["refusal"], null);
        } else {
            this.valueLink.setIn(["refusal"], this.savedRefusal || defaultRefusal);
        }
    }

    render() {
        const valueLink = this.valueLink = ValueLink.wrapValidator(this.props.valueLink, recompute, defaultDeposit);
        const refusal = valueLink.getIn(["refusal"]);
        const depositLabel = refusal ? "Dépôt initialement prévu" : "Dépôt";

        return <div className="form-horizontal">
            <div className="panel panel-default">
                <div className="panel-heading"><h4 className="panel-title">Informations générales</h4></div>
                <div className="panel-body">
                    <ShowValidation className="form-group form-group-sm" value={valueLink.getIn(["date"])}>
                        <label className="col-md-2 control-label">Date</label>
                        <div className="col-md-3">
                            <div className="input-group input-group-sm">
                                <DateInput valueLink={valueLink.bind(["date"])} className="form-control"/>
                                <span className="input-group-addon">{formatDayOfWeek(valueLink.getIn(["date"]))}</span>
                            </div>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-2 control-label">Référence</label>
                        <div className="col-md-3">
                            <TextInput valueLink={valueLink.bind(["reference"])} className="form-control"/>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <div className="col-md-offset-2 col-md-8">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={ refusal } onChange={()=>this.toggleRefusal()}/>
                                    La banque a refusé tout ou une partie du dépôt
                                </label>
                            </div>
                        </div>
                    </ShowValidation>
                    <AmountLine title={depositLabel} valueLink={valueLink.bind(["deposit"])} addDetails={()=>this.addCashbox("deposit")}/>
                    { refusal ? <AmountLine title="Montant refusé" valueLink={valueLink.bind(["refusal"])} addDetails={()=>this.addCashbox("refusal")}/> : null }
                    { refusal ?
                        <ShowValidation className="form-group form-group-sm">
                            <label className="col-md-2 control-label">Total</label>
                            <div className="col-md-3">
                                <p className="form-control-static">{formatAmount(valueLink.getIn(["total"]))}</p>
                            </div>
                        </ShowValidation>
                    : null }
                    { refusal ?
                        <ShowValidation className="form-group form-group-sm">
                            <label className="col-md-2 control-label">Raison du refus</label>
                            <div className="col-md-8">
                                <TextInput valueLink={valueLink.bind(["refusal", "reason"])} className="form-control"/>
                            </div>
                        </ShowValidation>
                    : null }
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-2 control-label">Tags</label>
                        <div className="col-md-8">
                            <TextInput className="form-control" valueLink={valueLink.bind(["tags"])} placeholder='TODO LABEL AND TAGS!!'/>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-2 control-label">Remarques</label>
                        <div className="col-md-8">
                            <TextInput type="textarea" className="form-control" valueLink={valueLink.bind(["comments"])} rows="4"/>
                        </div>
                    </ShowValidation>
                </div>
            </div>

            <AmountDetails title={depositLabel} valueLink={valueLink.bind(["deposit", "amountDetails"])} remove={()=>this.removeCashbox("deposit")}/>
            <AmountDetails title="Montant refusé" valueLink={valueLink.bind(["refusal", "amountDetails"])} remove={()=>this.removeCashbox("refusal")}/>
        </div>;
    }
}
