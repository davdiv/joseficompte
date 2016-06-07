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
import DateInput from "../dateInput";
import TextInput from "../textInput";
import AmountInput from "../amountInput";
import formatAmount from "../../formatting/amount";
import {formatDate, formatDayOfWeek} from "../../formatting/date";
import ShowValidation from "../showValidation";
import ValueLink from "@validation/valueLink";
import defaultCashbox from "@validation/cashbox/default";
import CashboxInput from "../cashbox/cashboxInput";
import recompute from "@validation/envelope/recompute";
import defaultEnvelope from "@validation/envelope/default";

const spliceLines = function (valueLink, spliceArgs) {
    valueLink.updateIn(["lines"], (lines) => lines.splice(...spliceArgs));
};

function DisplayDay (props) {
    const valueLink = props.valueLink;
    return <div className="panel panel-default">
        <div className="panel-heading">
            <h4 className="panel-title">{formatDayOfWeek(valueLink.getIn(["date"]))} {formatDate(valueLink.getIn(["date"]))}&nbsp;
                <div className="btn-group btn-group-xs pull-right">
                    <button className="btn btn-default" onClick={props.onAddClick}>
                        <span className="glyphicon glyphicon-plus"/>
                    </button>
                    {props.onCloseClick ?
                        <button className="btn btn-default" onClick={props.onCloseClick}>
                            <span className="glyphicon glyphicon-minus"/>
                        </button>
                    : null }
                </div>
            </h4>
        </div>
        <div className="panel-body">
            <ShowValidation className="form-group form-group-sm" value={valueLink.getIn(["date"])}>
                <label className="col-md-1 control-label">Date</label>
                <div className="col-md-10">
                    <div className="input-group">
                        <DateInput className="form-control" valueLink={valueLink.bind(["date"])}/>
                        <span className="input-group-addon">{formatDayOfWeek(valueLink.getIn(["date"]))}</span>
                    </div>
                </div>
            </ShowValidation>
            <ShowValidation className="form-group form-group-sm" value={valueLink.getIn(["team"])}>
                <label className="col-md-1 control-label">Equipe</label>
                <div className="col-md-10">
                    <TextInput type="textarea" className="form-control" valueLink={valueLink.bind(["team"])} rows="2"/>
                </div>
            </ShowValidation>
            { valueLink.mapBind(["lines"], (lineValueLink, index, list) => <ShowValidation key={index} className="form-group form-group-sm" value={lineValueLink.getIn(["amount"])}>
                <label className="col-md-1 control-label">{index == 0 ? "Opérations" : ""}</label>
                <div className="col-md-4">
                    <TextInput className="form-control" valueLink={lineValueLink.bind(["label"])} placeholder='TODO LABEL AND TAGS!!'/>
                </div>
                <div className="col-md-4">
                    <TextInput className="form-control" valueLink={lineValueLink.bind(["details"])} placeholder='Détails'/>
                </div>
                <div className="col-md-2">
                    <AmountInput className="form-control" valueLink={lineValueLink.bind(["amount"])}/>
                </div>
                <div className="btn-group btn-group-sm col-md-1">
                    <button className="btn btn-default" onClick={spliceLines.bind(null, valueLink, [index, 0, lineValueLink.value])}><span className="glyphicon glyphicon-plus"/></button>
                    { list.size >= 2 ? <button className="btn btn-default" onClick={spliceLines.bind(null, valueLink, [index, 1])}><span className="glyphicon glyphicon-minus"/></button> : null }
                </div>
            </ShowValidation>) }
            <ShowValidation className='form-group form-group-sm'>
                <label className="col-md-offset-8 col-md-1 control-label">Total</label>
                <div className="col-md-2">
                    <p className="form-control-static">{formatAmount(valueLink.getIn(["sumAmount"]))}</p>
                </div>
            </ShowValidation>
        </div>
    </div>;
}

export default class extends React.Component {

    spliceDays(spliceArgs) {
        this.valueLink.updateIn(["days"], (days) => days.splice(...spliceArgs));
    }

    removeCashbox() {
        const countedAmountDetails = this.valueLink.getIn(["countedAmountDetails"]);
        if (countedAmountDetails) {
            this.savedCountedAmountDetails = countedAmountDetails;
            this.valueLink.setIn(["countedAmountDetails"], null);
        }
    }

    addCashbox() {
        this.valueLink.setIn(["countedAmountDetails"], this.savedCountedAmountDetails || defaultCashbox);
    }

    render() {
        const valueLink = this.valueLink = ValueLink.wrapValidator(this.props.valueLink, recompute, defaultEnvelope);
        const countedAmountDetails = valueLink.getIn(["countedAmountDetails"]);
        return <div className="form-horizontal">
            {valueLink.mapBind(["days"], (valueLink, index, array) => <DisplayDay valueLink={valueLink} key={index} onAddClick={this.spliceDays.bind(this,[index, 0, valueLink.value])} onCloseClick={array.size >= 2 ? this.spliceDays.bind(this,[index, 1]) : null} />)}

            <div className="panel panel-default">
                <div className="panel-heading"><h4 className="panel-title">Total</h4></div>
                <div className="panel-body">
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-9 control-label">Montant réel</label>
                        { countedAmountDetails ?
                            <div className="col-md-2">
                                <p className="form-control-static">{formatAmount(valueLink.getIn(["countedAmount"]))}</p>
                            </div>
                        : null }
                        { !countedAmountDetails ?
                            <div className="col-md-2">
                                <div className="input-group input-group-sm">
                                    <AmountInput className="form-control" valueLink={valueLink.bind(["countedAmount"])}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" onClick={this.addCashbox.bind(this)} title="Détailler le montant réel">
                                            <span className="glyphicon glyphicon-list-alt"/>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        : null }
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-9 control-label">Somme</label>
                        <div className="col-md-2">
                            <p className="form-control-static">{formatAmount(valueLink.getIn(["sumAmount"]))}</p>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-9 control-label">Différence</label>
                        <div className="col-md-2">
                            <p className="form-control-static">
                                <span>{formatAmount(valueLink.getIn(["difference"]))}&nbsp;&nbsp;{valueLink.getIn(["difference"]) === 0 ? <span className="glyphicon glyphicon-ok-sign"/> : null }</span>
                            </p>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-1 control-label">Tags</label>
                        <div className="col-md-10">
                            <TextInput className="form-control" valueLink={valueLink.bind(["tags"])} placeholder='TODO LABEL AND TAGS!!'/>
                        </div>
                    </ShowValidation>
                    <ShowValidation className="form-group form-group-sm">
                        <label className="col-md-1 control-label">Remarques</label>
                        <div className="col-md-10">
                            <TextInput type="textarea" className="form-control" valueLink={valueLink.bind(["comments"])} rows="4"/>
                        </div>
                    </ShowValidation>
                </div>
            </div>

            { countedAmountDetails ?
                <div className="panel panel-default">
                    <div className="panel-heading"><h4 className="panel-title">Détails du montant réel: {formatAmount(valueLink.getIn(["countedAmountDetails","total","total","total"]))}
                        <button className="btn btn-default btn-xs pull-right" onClick={this.removeCashbox.bind(this)}>
                            <span className="glyphicon glyphicon-remove"/>
                        </button></h4>
                    </div>
                    <div className="panel-body">
                        <CashboxInput valueLink={valueLink.bind(["countedAmountDetails"])}/>
                    </div>
                </div>
            : null }

        </div>;
    }
}
