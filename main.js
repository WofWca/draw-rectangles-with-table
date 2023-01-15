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
