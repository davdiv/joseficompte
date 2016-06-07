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
import InternalLink from "@widgets/internalLink";
import ActionLink from "@widgets/actionLink";
import Navbar from "@widgets/navbar";
import DropdownLink from "@widgets/dropdownLink";
import appInfo from "@client/appInfo";
import {connect} from "react-redux";
import logout from "@actions/login/logout";

const footerStyle = {
    backgroundColor: "#f5f5f5",
    bottom: "0px",
    paddingTop: "20px",
    height: "60px",
    position: "absolute",
    width: "100%"
};

class Structure extends React.Component {
    render() {
        const {children, session, unsavedData, dispatch} = this.props;
        return <div>
            <Navbar brand={<InternalLink className="navbar-brand" href="/">{ appInfo.title }</InternalLink>}>
                <ul className="nav navbar-nav">
                    { unsavedData && unsavedData.size > 0 ?
                        <DropdownLink label="Données non enregistrées">
                            {unsavedData.keySeq().toArray().map(href => <li key={href}><InternalLink href={href}>{href}</InternalLink></li>)}
                        </DropdownLink>
                    : null }
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    { session ?
                        <DropdownLink label={ session.get("userDisplayName") }>
                            <li><ActionLink onClick={() => dispatch(logout())}>Se déconnecter</ActionLink></li>
                        </DropdownLink>
                    : null }
                </ul>
            </Navbar>
            {children}
            {session ?
            <div style={footerStyle}>
                <div className='container-fluid'>
                    <p className='text-muted'>Ce programme est un logiciel libre, sous license AGPLv3. <InternalLink href="/about">Cliquez ici pour plus d'informations.</InternalLink>
                    </p>
                </div>
            </div>
            : null}
        </div>;
    }
}

export default connect((state) => ({
    session: state.get("session"),
    unsavedData: state.get("unsavedData")
}))(Structure);
