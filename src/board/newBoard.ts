import { Board, Cell, Cells, CellType, Point, State } from "../types";
import { countMinesAround, isMineCell, random } from "./utils";

const emptyCell = (pos: Point, id: number): Cell => {
  return {
    id,
    pos,
    type: CellType.empty,
    revealed: false,
    flagged: false,
  };
};

const emptyBoard = (size: Point): Cells => {
  const board = [];

  let i = 0;
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      board.push(emptyCell({ y, x }, i));
      i++;
    }
  }

  return board;
};

export const placeMine = (board: Board) => {
  let pos: number;
  do {
    pos = random(1, board.size.x * board.size.y) - 1;
  } while (isMineCell(board.cells[pos]));

  board.cells[pos].type = CellType.mine;
};

const placeMines = (board: Board, bombs: number) => {
  for (let i = 0; i < bombs; i++) {
    placeMine(board);
  }
};

const numberCell = (cell: Cell, board: Board) => {
  const mines = countMinesAround(cell, board);

  if (mines === 0) {
    cell.type = CellType.empty;
    return;
  }

  cell.type = CellType.number;
  cell.number = mines;
};

export const placeNumberCells = (board: Board) => {
  for (let i = 0; i < board.cells.length; i++) {
    const cell = board.cells[i];
    if (cell.type === CellType.mine) continue;

    numberCell(cell, board);
  }
};

export const newBoard = ({
  x = 9,
  y = 9,
  bombs = 10,
}: {
  x?: number;
  y?: number;
  bombs?: number;
} = {}): Board => {
  const total = x * y;
  if (bombs > total) bombs = total;

  const board: Board = {
    cells: emptyBoard({ x, y }),
    size: {
      x,
      y,
    },
    bombs,
    first: true,
    left: bombs,
    state: State.playing,
  };

  placeMines(board, bombs);
  placeNumberCells(board);

  return board;
};
