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
import { render } from "react-dom";

export default class extends React.Component {

    componentWillMount() {
        if (process.browser) {
            const container = this.container = document.createElement("div");
            document.body.appendChild(container);
        }
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const container = this.container;
        if (container) {
            render(React.Children.only(this.props.children), container);
        }
    }

    componentWillUnmount() {
        const container = this.container;
        if (container) {
            document.body.removeChild(container);
        }
    }


    render() {
        return null;
    }
}
