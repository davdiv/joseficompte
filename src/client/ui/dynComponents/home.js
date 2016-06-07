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
import Structure from "../structure";
import InternalLink from "@widgets/internalLink";

export default () => <Structure>
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">Envelopes
                            <div className="btn-group btn-group-xs pull-right">
                                <InternalLink className="btn btn-default" href="/envelope/new"><span className="glyphicon glyphicon-plus"/></InternalLink>
                                <button className="btn btn-default"><span className="glyphicon glyphicon-refresh"/></button>
                            </div>
                        </h4>
                    </div>
                    <div className="panel-body">
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">Dépôts
                            <div className="btn-group btn-group-xs pull-right">
                                <InternalLink className="btn btn-default" href="/deposit/new"><span className="glyphicon glyphicon-plus"/></InternalLink>
                                <button className="btn btn-default"><span className="glyphicon glyphicon-refresh"/></button>
                            </div>
                        </h4>
                    </div>
                    <div className="panel-body">
                    </div>
                </div>
            </div>
        </div>
    </div>
</Structure>;
