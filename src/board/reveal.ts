import { Draft } from "immer";
import { Board, Cell, CellType } from "../types";
import { placeMine, placeNumberCells } from "./newBoard";
import { forCellsAround, lostGame } from "./utils";

const firstCellWasMine = (cell: Cell, board: Board): boolean => {
  if (board.size.x * board.size.y === board.bombs) return true;

  // place new mine
  placeMine(board);

  // remove old mine
  cell.type = CellType.empty;

  // recalculate mine numbers
  placeNumberCells(board);
  //numberCell(cell, board);

  // clear first status
  board.first = false;

  // reveal the cell now
  return revealCell(cell, board);
};

export const revealCell = (cell: Cell, board: Board): boolean => {
  if (cell.flagged) return false;

  if (cell.type === CellType.mine) {
    if (board.first) {
      return firstCellWasMine(cell, board);
    }

    return true;
  }

  if (cell.revealed) return false;
  board.first = false;

  cell.revealed = !cell.revealed;

  if (cell.type === CellType.empty) {
    return forCellsAround(cell, board, (cell) => revealCell(cell, board)).some(
      (val) => val
    );
  }

  return false;
};

export const revealCells = (board: Draft<Board>, payload: number) => {
  const cell = board.cells[payload];
  const isBomb = revealCell(cell, board);

  if (isBomb) {
    lostGame(board);
  }
};
