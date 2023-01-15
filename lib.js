/**
 * @typedef {{
 *   rowEndPositions: number[],
 *   colEndPositions: number[],
 *   isCellFilled: boolean[][],
 * }} Table
 */

/**
 * @returns {Table}
 */
export function createEmptyTable() {
  return {
    rowEndPositions: [Infinity],
    colEndPositions: [Infinity],
    isCellFilled: [
      [false]
    ],
  }
}

/**
 * Can be used to split both rows and columns.
 * If the table is already split at `splitAtCoordinate`, does nothing.
 * @param {Table} table
 * @param {'row' | 'col'} dimensionNameToSplit
 * @param {number} splitAtCoordinate
 * @returns {number} the index of the row or column that now ends at `splitAtCoordinate`.
 */
export function splitTableDimension(table, dimensionNameToSplit, splitAtCoordinate) {
  const dimension = table[
    dimensionNameToSplit === 'row'
      ? 'rowEndPositions'
      : 'colEndPositions'
  ];
  // TODO perf: use binary search (say, `sortedIndex` from the Lodash library).
  // A.k.a. the first row which ends before `splitAtCoordinate`.
  const indOfRowOrColToSplit = dimension.findIndex(endPos => endPos >= splitAtCoordinate);
  const toReturn = indOfRowOrColToSplit;
  const rowOrColEndPos = dimension[indOfRowOrColToSplit];
  if (rowOrColEndPos === splitAtCoordinate) {
    // Don't create a 0-size division.
    return toReturn;
  }
  // Simply insert it, preserving the order.
  dimension.splice(indOfRowOrColToSplit, 0, splitAtCoordinate);

  // Now, since it's just a split, fill both of the new parts with what the previously
  // one part contained.
  if (dimensionNameToSplit === 'row') {
    const valuesBeforeSplit = table.isCellFilled[indOfRowOrColToSplit].map(v => v);
    table.isCellFilled.splice(indOfRowOrColToSplit, 0, valuesBeforeSplit);
  } else {
    const numRows = table.isCellFilled.length;
    for (let rowI = 0; rowI < numRows; rowI++) {
      const valueBeforeSplit = table.isCellFilled[rowI][indOfRowOrColToSplit];
      table.isCellFilled[rowI].splice(indOfRowOrColToSplit, 0, valueBeforeSplit);
    }
  }

  return toReturn;
}

/**
 * @typedef {{
 *   topLeft: { x: number, y: number },
 *   bottomRight: { x: number, y: number },
 * }} Rectangle
 */

/**
 * @param {Table} table
 * @param {Rectangle} rectangle
 */
export function addRectangleToTable(table, rectangle) {
  const fillStartColInd = splitTableDimension(table, 'col', rectangle.topLeft.x) + 1;
  const fillStartRowInd = splitTableDimension(table, 'row', rectangle.topLeft.y) + 1;
  const fillEndColInd = splitTableDimension(table, 'col', rectangle.bottomRight.x);
  const fillEndRowInd = splitTableDimension(table, 'row', rectangle.bottomRight.y);

  for (let rowI = fillStartRowInd; rowI <= fillEndRowInd; rowI++) {
    for (let colI = fillStartColInd; colI <= fillEndColInd; colI++) {
      table.isCellFilled[rowI][colI] = true;
    }
  }

  // TODO what if rectangle starts at [0, 0]? No need to create column and row?
}
