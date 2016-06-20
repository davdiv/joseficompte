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
import PopoverLogic from "./popoverLogic";
import ValueLink from "@validation/valueLink";
import recompute from "@validation/detailedAmount/recompute";
import AmountBasicInput from "../amountInput";
import formatAmount from "../../formatting/amount";
import CashboxInput from "../cashbox/cashboxInput";
import cashboxForAmount from "@validation/cashbox/forAmount";
import Body from "../body";

export default class extends PopoverLogic {

    togglePopover() {
        const details = this.valueLink.getIn(["details"]);
        if (!details) {
            this.valueLink.setIn(["details"], cashboxForAmount(this.valueLink.getIn(["amount"])));
        }
        super.togglePopover();
    }

    removeDetails() {
        this.valueLink.setIn(["details"], null);
        this.domElt.firstChild.select();
        this.setState({
            popover: null
        });
    }

    render() {
        const valueLink = this.valueLink = ValueLink.wrapValidator(this.props.valueLink, recompute);
        const hasDetails = !!valueLink.getIn(["details"]);
        const {popover} = this.state;
        return <div className="input-group input-group-sm" ref={(domElt)=>this.domElt = domElt}>
            <AmountBasicInput className="form-control" valueLink={valueLink.bind(["amount"])} readOnly={hasDetails}/>
            <span className="input-group-btn">
                {hasDetails ?
                    <button className="btn btn-default" onClick={()=>this.removeDetails()}>
                        <span className="glyphicon glyphicon-remove"/>
                    </button>
                : null}
                <button className="btn btn-default" onClick={()=>this.togglePopover()}>
                    <span className="glyphicon glyphicon-list-alt"/>
                </button>
            </span>
            {popover && hasDetails ? <Body>
                <div className="popover" style={popover}>
                    <h2 className="popover-title">Montant: {formatAmount(valueLink.getIn(["amount"]))}
                    <button onClick={()=>this.togglePopover()} className="close">&times;</button></h2>
                    <div className="popover-content">
                        <CashboxInput valueLink={valueLink.bind(["details"])}/>
                    </div>
                </div>
            </Body> : null}
        </div>;
    }
}
