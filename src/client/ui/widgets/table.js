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
import Pagination from "./pagination";

const paginationStyle = {
    marginBottom: "0px",
    marginTop: "0px"
};

export default ({title, items, pageSize, currentPageIndex, onCurrentPageIndexChange, columns}) => {
    const firstItemIndex = pageSize * (currentPageIndex - 1);
    const firstNextPageItemIndex = pageSize * currentPageIndex;
    const itemsToDisplay = items.slice(firstItemIndex, firstNextPageItemIndex);
    return <div className="panel panel-default">
        { title ?
            <div className="panel-heading">
                <h4 className="panel-title">{title}</h4>
            </div>
        : null }
        <table className="table">
            <thead>
                <tr>{columns.map((column, columnIndex) => <th key={columnIndex} style={column.style}>{column.title}</th>)}</tr>
            </thead>
            <tbody>
                {itemsToDisplay.map((item, itemIndex) => <tr key={firstItemIndex + itemIndex}>
                    {columns.map((column, columnIndex) => <td key={columnIndex}>{column.content(item, firstItemIndex + itemIndex, items)}</td>)}
                </tr>)}
            </tbody>
        </table>
        { items.length > pageSize ?
            <div className="panel-footer text-center">
                <Pagination
                    itemsCount={items.length}
                    pageSize={pageSize}
                    currentPageIndex={currentPageIndex}
                    onCurrentPageIndexChange={onCurrentPageIndexChange}
                    style={paginationStyle}
                />
            </div>
        : null }
    </div>;
};
