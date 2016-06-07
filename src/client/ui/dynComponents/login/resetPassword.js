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
import resetPassword from "@actions/login/resetPassword/resetPassword";
import Form from "@widgets/form";
import ValueLink from "@validation/valueLink";
import TextInput from "@widgets/textInput";
import InternalLink from "@widgets/internalLink";
import ShowValidation from "@widgets/showValidation";
import ErrorBox from "@widgets/errorBox";
import {connect} from "react-redux";
import Window from "./window";

const ResetPassword = ({valueLink, onSubmit}) => {
    valueLink = ValueLink.wrap(valueLink);
    const done = valueLink.getIn(["done"]);
    if (done) {
        return <Window processing={valueLink.getIn(["processing"])} title="Réinitialisation de votre mot de passe">
            <div className="alert alert-success">
                <p>Votre mot de passe a été changé avec succès.</p>
            </div>
            <div>
                <InternalLink href="/">Cliquez ici pour aller à la page d'accueil.</InternalLink>
            </div>
        </Window>;
    }

    return <Window processing={valueLink.getIn(["processing"])} title="Réinitialisation de votre mot de passe">
        <div className="alert alert-info">
            <p>Pour réinitialiser votre mot de passe, veuillez taper deux fois ci-dessous votre nouveau mot de passe et valider.</p>
            <p>Votre mot de passe doit respecter les règles suivantes:</p>
            <ul>
                <li>Il doit comporter au minimum 10 caractères et au maximum 160 caractères.</li>
                <li>Il doit contenir au moins une lettre minuscule.</li>
                <li>Il doit contenir au moins une lettre majuscule.</li>
                <li>Il doit contenir au moins un chiffre.</li>
                <li>Il doit contenir au moins un caractère autre qu'une lettre ou un chiffre.</li>
            </ul>
        </div>
        <ErrorBox error={valueLink.getIn(["error"])} />
        <Form onSubmit={onSubmit}>
            <ShowValidation className="form-group">
                <label className="col-md-3 control-label">Adresse électronique</label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon">@</span>
                        <TextInput
                            readOnly
                            type="text"
                            className="form-control"
                            valueLink={valueLink.bind(["email"])}
                        />
                    </div>
                </div>
            </ShowValidation>
            <ShowValidation className="form-group">
                <label className="col-md-3 control-label">Nouveau mot de passe</label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-lock"/></span>
                        <TextInput
                            type="password"
                            className="form-control"
                            valueLink={valueLink.bind(["password1"])}
                        />
                    </div>
                </div>
            </ShowValidation>
            <ShowValidation className="form-group">
                <label className="col-md-3 control-label">Confirmer</label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-lock"/></span>
                        <TextInput
                            type="password"
                            className="form-control"
                            valueLink={valueLink.bind(["password2"])}
                        />
                    </div>
                </div>
            </ShowValidation>
            <div className="text-center">
                <button className="btn btn-primary" type="submit">Valider</button>{" "}
            </div>
        </Form>
        <div>
            <InternalLink href="/">Cliquez ici pour aller à la page d'accueil.</InternalLink>
        </div>
    </Window>;
};

export default connect(undefined, (dispatch) => ({
    onSubmit: () => dispatch(resetPassword())
}))(ResetPassword);
