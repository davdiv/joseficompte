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
import CashboxDisplay from "../cashbox/cashboxDisplay";
import formatAmount from "../../formatting/amount";
import Body from "../body";
import ActionLink from "../actionLink";

export default class extends PopoverLogic {
    render() {
        const value = this.props.value;
        if (!value) {
            return null;
        }
        const details = value.get("details");
        const formattedAmount = formatAmount(value.get("amount"));
        const {popover} = this.state;
        return details ?
            <span ref={(domElt)=>this.domElt = domElt}>
                <ActionLink onClick={()=>this.togglePopover()}>
                    {formattedAmount}
                </ActionLink>
                {popover ? <Body>
                    <div className="popover" style={popover}>
                        <h2 className="popover-title">Montant: {formattedAmount}
                        <button onClick={()=>this.togglePopover()} className="close">&times;</button></h2>
                        <div className="popover-content">
                            <CashboxDisplay value={details}/>
                        </div>
                    </div>
                </Body> : null}
            </span>
            : <span>{formattedAmount}</span>;
    }
}
