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
import ActionLink from "./actionLink";

const pagesSeparator = "\u2026";

const addNumbers = (array, begin, end) => {
    for (let i = begin; i <= end; i++) {
        array.push(i);
    }
};

export default ({
    style,
    itemsCount,
    pageSize,
    currentPageIndex,
    onCurrentPageIndexChange
}) => {
    const pagesCount = Math.max(1, Math.ceil(itemsCount / pageSize));
    const pages = [];
    if (pagesCount <= 11) {
        addNumbers(pages, 1, pagesCount);
    } else if (currentPageIndex <= 6 || isNaN(Number(currentPageIndex))) {
        addNumbers(pages, 1, 8);
        pages.push(-2);
        addNumbers(pages, pagesCount - 1, pagesCount);
    } else if (currentPageIndex >= pagesCount - 5) {
        addNumbers(pages, 1, 2);
        pages.push(-1);
        addNumbers(pages, pagesCount - 7, pagesCount);
    } else {
        addNumbers(pages, 1, 2);
        pages.push(-1);
        addNumbers(pages, currentPageIndex - 2, currentPageIndex + 2);
        pages.push(-2);
        addNumbers(pages, pagesCount - 1, pagesCount);
    }
    const toPage = (page) => () => page !== currentPageIndex && page >= 1 && page <= pagesCount ? onCurrentPageIndexChange(page) : null;
    return <ul className="pagination pagination-sm" style={style}>
            <li className={ currentPageIndex <= 1 ? "disabled" : "" }><ActionLink onClick={toPage(currentPageIndex - 1)}>&laquo;</ActionLink></li>
            { pages.map(page => <li key={page} className={ page === currentPageIndex ? "active" : page > 0 ? "" : "disabled" }>
                <ActionLink onClick={toPage(page)}>{page > 0 ? page : pagesSeparator}</ActionLink>
            </li> ) }
            <li className={ currentPageIndex >= pagesCount ? "disabled" : "" }><ActionLink onClick={toPage(currentPageIndex + 1)}>&raquo;</ActionLink></li>
        </ul>;
};
