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
import setValue from "@actions/setValue";
import cancelEdition from "@actions/revisionsManager/cancelEdition";
import saveEditedValue from "@actions/revisionsManager/saveEditedValue";
import loadRevision from "@actions/revisionsManager/loadRevision";
import Structure from "../structure";
import DynComponent from "@widgets/dynComponent";
import InternalLink from "@widgets/internalLink";
import {connect} from "react-redux";

const tabsStyle = {
    marginBottom: "15px"
};

const RevisionEditor = ({value, lastRevision, editedValue, changeEditedValue, saveEditedValue, cancelEdition, refreshLastRevision}) => {
    const lastRevisionHref = value.get("lastRevisionHref");
    const previewHref = value.get("previewHref");
    const editionHref = value.get("editionHref");
    const curHref = value.get("curHref");
    const showEditedValue = curHref === editionHref || curHref === previewHref;
    const showLastRevision = curHref === lastRevisionHref;
    const lastRevisionValue = lastRevision ? lastRevision.get("content") : null;
    const valueToDisplay = showEditedValue ? editedValue || lastRevisionValue : lastRevisionValue;

    const Tab = ({href, children, condition}) => href && (condition !== false || href === curHref) ?
        <li className={ href === curHref ? "active" : ""}><InternalLink href={href}>{children}</InternalLink></li>
        : null;

    return <Structure>
        <div className="container-fluid">
            <div className="pull-right">
                <div className="btn-group btn-group-sm">
                    { showEditedValue && !!editedValue ? <button className="btn btn-default" title="Enregistrer" onClick={saveEditedValue}><span className="glyphicon glyphicon-save"/></button> : null}
                    { showEditedValue ? <button className="btn btn-default" title="Annuler les modifications" onClick={cancelEdition}><span className="glyphicon glyphicon-remove"/></button> : null}
                    { showLastRevision ? <button className="btn btn-default" title="Rafraichir" onClick={refreshLastRevision}><span className="glyphicon glyphicon-refresh"/></button> : null}
                </div>
            </div>
            <ul className="nav nav-tabs" style={ tabsStyle }>
                <Tab href={lastRevisionHref}>Version enregistrée</Tab>
                <Tab href={editionHref}>Edition</Tab>
                <Tab href={previewHref} condition={!!editedValue}>Aperçu</Tab>
            </ul>
            <div>
            {curHref === editionHref ?
                <DynComponent
                    dynComponent={value.get("editComponent")}
                    valueLink={ { value: valueToDisplay, requestChange: changeEditedValue } }
                />
            : null}
            {curHref !== editionHref ?
                (valueToDisplay ?
                    <DynComponent
                        dynComponent={value.get("displayComponent")}
                        value={ valueToDisplay }
                    />
                :
                    <div className="alert alert-info">
                        Il n'y a aucune donnée à afficher.
                    </div>
                )
            : null}
            </div>
            <div className="pull-right">
                { showEditedValue && !!editedValue ? <button className="btn btn-primary" onClick={saveEditedValue}><span className="glyphicon glyphicon-save"/> Enregistrer</button> : null}{" "}
                { showEditedValue ? <button className="btn btn-default" onClick={cancelEdition}><span className="glyphicon glyphicon-remove"/> Annuler</button> : null}
            </div>
            <br/>
            <br/>
            <br/>
        </div>
    </Structure>;
};

export default connect((state, {value}) => ({
    editedValue: state.getIn(["unsavedData", value.get("editionHref")]),
    lastRevision: state.getIn(["cache", value.get("docTypePath"), value.get("documentId"), "latest", "revision"])
}), (dispatch, {value}) => ({
    changeEditedValue: (newValue) => dispatch(setValue(["unsavedData", value.get("editionHref")], newValue)),
    cancelEdition: () => dispatch(cancelEdition({
        editionHref: value.get("editionHref"),
        lastRevisionHref: value.get("lastRevisionHref")
    })),
    saveEditedValue: () => dispatch(saveEditedValue({
        editionHref: value.get("editionHref"),
        docTypePath: value.get("docTypePath"),
        documentId: value.get("documentId")
    })),
    refreshLastRevision: () => dispatch(loadRevision({
        docTypePath: value.get("docTypePath"),
        documentId: value.get("documentId"),
        refresh: true
    }))
}))(RevisionEditor);
