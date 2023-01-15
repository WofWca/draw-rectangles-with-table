/**
 * @license
 * Copyright 2023 WofWca <wofwca@protonmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { addRectangleToTable, createEmptyTable } from "./lib.js";

const tableP = (async () => {
  const table = createEmptyTable();
  const rectangles = await (await fetch('./rectangles.json')).json();
  for (const rectangle of rectangles) {
    addRectangleToTable(table, rectangle);
  }
  return table;
})();

window.onload = async () => {
  const tBodyEl = document.querySelector('tbody');
  if (!tBodyEl) throw new Error();
  const table = await tableP;

  // The last row is an infinite-length row
  const lastRowToDrawInd = table.rowEndPositions.length - 1;
  let currRowStartCoords = 0;
  for (let rowI = 0; rowI < lastRowToDrawInd; rowI++) {
    const trEl = tBodyEl.insertRow();
    const currRowEndCoords = table.rowEndPositions[rowI];
    trEl.style.height = currRowEndCoords - currRowStartCoords + 'px';

    // The last column is an infinite-length column.
    const lastColToDrawInd = table.colEndPositions.length - 1;
    let currColStartCoords = 0;
    for (let colI = 0; colI < lastColToDrawInd; colI++) {
      const cellEl = trEl.insertCell();
      const currColEndCoords = table.colEndPositions[colI];

      // TODO refactor: only need to set width of one column.
      cellEl.style.width = currColEndCoords - currColStartCoords + 'px';
      if (table.isCellFilled[rowI][colI]) {
        cellEl.style.backgroundColor = 'orange';
      }

      currColStartCoords = currColEndCoords;
    }

    currRowStartCoords = currRowEndCoords;
  }
}
