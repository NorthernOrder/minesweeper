import { Board, Cell, CellType, State } from "../types";

export const isMineCell = (cell: Cell): boolean => cell.type === CellType.mine;

export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const forCellsAround = <T = any>(
  cell: Cell,
  { cells, size }: Board,
  callback: (cell: Cell) => T
): T[] => {
  const values = [] as T[];

  // Top Row
  if (cell.pos.y !== 0) {
    // Top Left
    if (cell.pos.x !== 0) values.push(callback(cells[cell.id - size.x - 1]));

    // Top Middle
    values.push(callback(cells[cell.id - size.x]));

    // Top Right
    if (size.x - 1 > cell.pos.x)
      values.push(callback(cells[cell.id - size.x + 1]));
  }

  // Middle Row
  // Middle Left
  if (cell.pos.x !== 0) values.push(callback(cells[cell.id - 1]));

  // Middle Right
  if (size.x - 1 > cell.pos.x) values.push(callback(cells[cell.id + 1]));

  // Bottom Row
  if (size.y - 1 > cell.pos.y) {
    // Bottom Left
    if (cell.pos.x !== 0) values.push(callback(cells[cell.id + size.x - 1]));

    // Bottom Middle
    values.push(callback(cells[cell.id + size.x]));

    // Bottom Right
    if (size.x - 1 > cell.pos.x)
      values.push(callback(cells[cell.id + size.x + 1]));
  }

  return values;
};

export const countMinesAround = (cell: Cell, board: Board): number =>
  forCellsAround(cell, board, (cell) => isMineCell(cell)).filter(Boolean)
    .length;

export const countFlagsAround = (cell: Cell, board: Board): number =>
  forCellsAround(cell, board, (cell) => cell.flagged).filter(Boolean).length;

export const lostGame = (board: Board) => {
  board.cells.forEach((cell) => {
    if (cell.type === CellType.mine) cell.revealed = true;
  });
  board.state = State.lost;
};
