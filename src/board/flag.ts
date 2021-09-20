import { Draft } from "immer";
import { Cell, Board } from "../types";

const toggleCellFlag = (cell: Cell, board: Board) => {
  if (!cell.flagged) {
    cell.flagged = true;
    board.left--;
  } else {
    cell.flagged = false;
    board.left++;
  }
};

export const flagCell = (board: Draft<Board>, payload: number) => {
  const cell = board.cells[payload];

  toggleCellFlag(cell, board);
};
