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
import Processing from "./processing";
import ActionLink from "@widgets/actionLink";

const preventDefault = (event) => event.preventDefault();

const dropdownStyle = {
    minWidth: "100%"
};

const changeSelection = (increment) => function (event) {
    const {open, processing, error, suggestions, selectedIndex} = this.state;
    if (open) {
        if (!processing && !error && suggestions && suggestions.length > 0) {
            const newIndex = Math.max(-1, Math.min(selectedIndex + increment, suggestions.length - 1));
            if (newIndex !== selectedIndex) {
                this.setState({
                    selectedIndex: newIndex
                });
            }
        }
    } else {
        this.updateSuggestions(event.target.value);
    }
    event.preventDefault();
};

const keyActions = {
    "ArrowDown": changeSelection(1),
    "ArrowUp": changeSelection(-1),
    "Enter": function(event) {
        const {open, error, suggestions, selectedIndex} = this.state;
        if (open && !error && suggestions && selectedIndex > -1 && selectedIndex < suggestions.length) {
            this.onChooseSuggestion(selectedIndex, event);
        }
    },
    "Tab": function() {
        // Tab: let's close the dropdown right now, before the focus changes
        this.closeSuggestions();
    }
};

const defaultSuggestionDisplay = ({value}) => <span>{value}</span>;

export default class extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    onInput(event) {
        this.updateSuggestions(event.target.value);
    }

    closeSuggestions() {
        this.setState({
            open: false,
            processing: null,
            suggestions: null,
            selectedIndex: -1,
            error: null
        });
    }

    onKeyDown(event) {
        const keyAction = keyActions[event.key];
        if (keyAction) {
            keyAction.call(this, event);
        }
    }

    onChooseSuggestion(suggestionIndex, event) {
        const {suggestions} = this.state;
        const suggestion = suggestions[suggestionIndex];
        const chooseSuggestion = this.props.onChooseSuggestion;
        const activeElement = document.activeElement;
        const info = {
            event: event,
            suggestion: suggestion,
            suggestionIndex: suggestionIndex,
            entry: activeElement.value
        };
        chooseSuggestion(info);
        event.preventDefault();
        activeElement.value = info.entry;
        this.closeSuggestions();
    }

    async updateSuggestions(entry) {
        const processing = {};
        this.setState({
            open: true,
            processing: processing,
            suggestions: ["a", "b", "c", "d", "e"],
            selectedIndex: -1
        });
        const computeSuggestions = this.props.onComputeSuggestions;
        const nextState = {
            processing: null,
            suggestions: null,
            selectedIndex: -1,
            error: null
        };
        try {
            nextState.suggestions = await computeSuggestions(entry);
        } catch (error) {
            nextState.error = error;
        }
        // check that we are still waiting for this entry
        if (this.state.processing === processing) {
            this.setState(nextState);
        }
    }

    render() {
        const {SuggestionDisplay = defaultSuggestionDisplay} = this.props;
        const {open, processing, error, suggestions, selectedIndex} = this.state;
        return <span className={`dropdown ${open ? "open" : ""}`}>
            <span onInput={(event)=>this.updateSuggestions(event.target.value)}
                onBlur={()=>this.closeSuggestions()}
                onKeyDown={(event)=>this.onKeyDown(event)} >{this.props.children}</span>
            {open ?
                <ul className="dropdown-menu" onMouseDown={preventDefault} onClick={preventDefault} style={dropdownStyle}>
                    {processing ?
                        <li className="disabled"><ActionLink><Processing/> Recherche en cours...</ActionLink></li>
                    : error ?
                        <li className="disabled"><a href="#">{error}</a></li>
                    : suggestions && suggestions.length > 0 ?
                        suggestions.map((suggestion, suggestionIndex) =>
                            <li key={suggestionIndex} className={ selectedIndex === suggestionIndex ? "active" : ""}>
                                <ActionLink
                                    onMouseOver={() => this.setState({selectedIndex:suggestionIndex})}
                                    onClick={(event) => this.onChooseSuggestion(suggestionIndex, event)}>
                                    <SuggestionDisplay value={suggestion}/>
                                </ActionLink>
                            </li>
                        )
                    : <li className="disabled"><ActionLink href="#">Pas de suggestion</ActionLink></li>
                    }
                </ul>
            : null }
        </span>;
    }
}
