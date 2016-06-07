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
import ExternalLink from "@widgets/externalLink";

export default () => <Structure>
    <div className="container">
        <h2>Qu'est-ce que <i>Joseficompte</i> ?</h2>
        <p><i>Joseficompte</i> est un logiciel libre pour la gestion des comptes.</p>
        <p>Il est en cours de développement, premièrement pour la gestion de <ExternalLink href='http://bras-ouverts.fr'>l'association Bras Ouverts</ExternalLink>, mais
        il sera également utilisable par n'importe quelle autre association.</p>
        <p>Ce logiciel se veut à la fois simple d'utilisation et complet.</p>
        <h2>Pourquoi le nom <i>Joseficompte</i> ?</h2>
        <p>Le nom <i>Joseficompte</i> évoque le personnage de Joseph, dans la Bible,
        qui a été un gérant fidèle, d'abord pour la maison de Potiphar, où il était esclave, puis
        dans la prison, où il a été enfermé injustement, et enfin pour l'administration de toute l'Egypte,
        qui lui a été confiée par le pharaon.</p>
        <p>Vous pouvez retrouver cette histoire dans la Bible, aux <ExternalLink href='http://www.topchretien.com/topbible/genese.39.1/S21/'>chapitres 39 à 41 de la Genèse</ExternalLink>.</p>
        <h2>Quelques citations <small>concernant les comptes</small></h2>
            <blockquote>
                <p>Un homme fidèle est comblé de bénédictions, mais celui qui est pressé de s'enrichir ne restera pas impuni.</p>
                <footer><cite>La Bible, <ExternalLink href='http://www.topchretien.com/topbible/proverbes.28.20/S21/'>Proverbes 28.20</ExternalLink>, traduction Segond 21</cite></footer>
            </blockquote>

            <blockquote>
                <p>Celui qui est fidèle dans les petites choses l'est aussi dans les grandes, et celui qui est malhonnête dans les petites choses l'est aussi dans les grandes. Si donc vous n'avez pas été fidèles dans les richesses injustes, qui vous confiera les biens véritables ? Et si vous n'avez pas été fidèles dans ce qui est à autrui, qui vous donnera ce qui est à vous ?</p>
                <footer>Jésus-Christ dans <cite>La Bible, <ExternalLink href='http://www.topchretien.com/topbible/luc.16.10/S21/'>Luc 16.10-12</ExternalLink>, traduction Segond 21</cite></footer>
            </blockquote>

            <blockquote>
                <p>Ne vous amassez pas des trésors sur la terre, où les mites et la rouille détruisent et où les voleurs percent les murs pour voler, mais amassez-vous des trésors dans le ciel, où les mites et la rouille ne détruisent pas et où les voleurs ne peuvent pas percer les murs ni voler! En effet, là où est ton trésor, là aussi sera ton cœur.</p>
                <footer>Jésus-Christ dans <cite>La Bible, <ExternalLink href='http://www.topchretien.com/topbible/matthieu.6.19/S21'>Matthieu 6.19-21</ExternalLink>, traduction Segond 21</cite></footer>
            </blockquote>

        <h2>Développement</h2>
        <p><i>Joseficompte</i> est un logiciel libre ; vous pouvez le redistribuer ou le
        modifier suivant les termes de la <ExternalLink href="http://www.gnu.org/licenses/agpl-3.0">Licence publique générale
        GNU Affero</ExternalLink> telle que publiée par la Free Software Foundation ;
        soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.</p>
        <p>Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS
        AUCUNE GARANTIE ; sans même la garantie tacite de QUALITÉ MARCHANDE ou
        d'ADÉQUATION à UN BUT PARTICULIER. Consultez la <ExternalLink href="http://www.gnu.org/licenses/agpl-3.0">Licence publique
        générale GNU Affero</ExternalLink> pour plus de détails.</p>
        <p>Le code source de ce programme est <ExternalLink href="https://github.com/davdiv/joseficompte">disponible sur Github</ExternalLink>.</p>
        <p>Ce logiciel, écrit en langage JavaScript, utilise des librairies/ressources provenant des sources suivantes:</p>
        <ul>
            <li><ExternalLink href='https://facebook.github.io/react/'>React</ExternalLink></li>
            <li><ExternalLink href='https://facebook.github.io/immutable-js'>Immutable.js</ExternalLink></li>
            <li><ExternalLink href='http://getbootstrap.com/'>Bootstrap</ExternalLink></li>
            <li><ExternalLink href='https://webpack.github.io/docs/'>Webpack</ExternalLink></li>
            <li><ExternalLink href='https://www.designcontest.com/'>designcontest</ExternalLink></li>
            <li><ExternalLink href='http://antialiasfactory.deviantart.com/'>antialiasfactory</ExternalLink></li>
            <li>et autre...</li>
        </ul>
    </div>
</Structure>;
