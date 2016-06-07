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
import {unwrapValue} from "@validation/errorValue";
import {connect} from "react-redux";
import login from "@actions/login/login";
import ValueLink from "@validation/valueLink";
import emailValidator from "@validation/email";
import TextInput from "@widgets/textInput";
import Form from "@widgets/form";
import InternalLink from "@widgets/internalLink";
import ShowValidation from "@widgets/showValidation";
import ErrorBox from "@widgets/errorBox";
import Window from "./window";

const unwrapEmail = unwrapValue("");

const Login = ({valueLink, onSubmit}) => {
    valueLink = ValueLink.wrap(valueLink);
    return <Window processing={valueLink.getIn(["processing"])} title="Authentification">
        <div className="alert alert-info">
            <p>Pour accéder à cette application, vous devez vous identifier.</p>
            <p>Si vous faites partie des utilisateurs autorisés, veuillez entrer ci-dessous votre adresse électronique et votre mot de passe et valider.</p>
        </div>
        <ErrorBox error={valueLink.getIn(["error"])} />
        <Form onSubmit={onSubmit}>
            <ShowValidation className="form-group" value={valueLink.getIn(["email"])}>
                <label className="col-md-3 control-label">Adresse électronique</label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon">@</span>
                        <TextInput
                            type="text"
                            className="form-control"
                            valueLink={valueLink.bind(["email"])}
                            validator={emailValidator}
                        />
                    </div>
                </div>
            </ShowValidation>
            <ShowValidation className="form-group">
                <label className="col-md-3 control-label">Mot de passe</label>
                <div className="col-md-7">
                    <div className="input-group">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-lock"/></span>
                        <TextInput
                            type="password"
                            className="form-control"
                            valueLink={valueLink.bind(["password"])}
                        />
                    </div>
                </div>
            </ShowValidation>
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Valider</button>{" "}
                <InternalLink className="btn btn-default" path="/login/resetPassword/sendEmail" query={ {email: unwrapEmail(valueLink.getIn(["email"]))} }>Mot de passe oublié</InternalLink>
            </div>
        </Form>
    </Window>;
};

export default connect(null, (dispatch) => ({
    onSubmit: () => dispatch(login())
}))(Login);
