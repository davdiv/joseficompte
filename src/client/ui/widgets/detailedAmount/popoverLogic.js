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

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            popover: null
        };
    }

    computePopoverStyle() {
        const rect = this.domElt.getBoundingClientRect();
        return {
            display:"block",
            left: "30px",
            top: `${rect.top + rect.height + window.scrollY + 5}px`,
            right: "30px",
            minWidth: "340px",
            maxWidth: "none",
            marginBottom: "30px"
        };
    }

    togglePopover() {
        this.setState({
            popover: this.state.popover ? null : this.computePopoverStyle()
        });
    }
}
