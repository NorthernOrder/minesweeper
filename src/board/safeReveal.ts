import { Draft } from "immer";
import { Board } from "../types";
import { revealCell } from "./reveal";
import {
  countFlagsAround,
  countMinesAround,
  forCellsAround,
  lostGame,
} from "./utils";

export const safeRevealCells = (board: Draft<Board>, payload: number) => {
  const cell = board.cells[payload];

  const mines = countMinesAround(cell, board);
  const flags = countFlagsAround(cell, board);
  if (flags !== mines) return;

  const list = forCellsAround(cell, board, (cell) => revealCell(cell, board));

  if (list.some((mine) => mine)) {
    lostGame(board);
    return;
  }
};
