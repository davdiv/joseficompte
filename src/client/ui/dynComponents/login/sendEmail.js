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
import Form from "@widgets/form";
import TextInput from "@widgets/textInput";
import sendEmail from "@actions/login/resetPassword/sendEmail";
import ValueLink from "@validation/valueLink";
import InternalLink from "@widgets/internalLink";
import emailValidator from "@validation/email";
import ShowValidation from "@widgets/showValidation";
import ErrorBox from "@widgets/errorBox";
import {connect} from "react-redux";
import Window from "./window";

const SendEmail = ({valueLink, onSubmit}) => {
    valueLink = ValueLink.wrap(valueLink);
    const sentEmail = valueLink.getIn(["sentEmail"]);
    if (sentEmail) {
        return <Window processing={valueLink.getIn(["processing"])} title="Réinitialisation de votre mot de passe">
            <div className="alert alert-success">
                <p>Si l'adresse électronique <strong>{valueLink.getIn(["email"])}</strong> que vous avez indiquée est bien enregistrée dans notre base de données, vous allez recevoir à cette adresse un lien pour réinitialiser votre mot de passe.</p>
                <p>Si vous n'avez toujours rien reçu d'ici quelques minutes:</p>
                <ul>
                    <li>Vérifiez que vous avez correctement tapé votre adresse électronique.</li>
                    <li>Vérifiez si le courriel n'a pas été bloqué par un filtre anti-spam.</li>
                    <li>Renouvelez votre demande de réinitialisation de mot de passe.</li>
                    <li>En cas de problème répété, contactez l'administrateur de cette application.</li>
                </ul>
            </div>
            <div>
                <InternalLink href="/">Cliquez ici pour aller à la page d'accueil.</InternalLink>
            </div>
        </Window>;
    }

    return <Window processing={valueLink.getIn(["processing"])} title="Réinitialisation de votre mot de passe">
        <div className="alert alert-info">
            <p>Si vous êtes un utilisateur enregistré, et que vous souhaitez réinitialiser votre mot de passe, veuillez indiquer ci-dessous votre adresse électronique et valider.</p>
            <p>Vous recevrez alors un courriel avec un lien pour réinitialiser votre mot de passe.</p>
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
            <div className="text-center">
                <button className="btn btn-primary" type="submit">Valider</button>{" "}
            </div>
        </Form>
    </Window>;
};

export default connect(undefined, (dispatch) => ({
    onSubmit: () => dispatch(sendEmail())
}))(SendEmail);
