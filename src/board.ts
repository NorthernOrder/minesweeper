import { Cell, CellType, Point, Cells, Board, State } from "./types";

const isMineCell = (cell: Cell): boolean => cell.type === CellType.mine;

const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getId = (point: Point) => `${point.y}-${point.x}`;

const emptyCell = (pos: Point, idx: number): Cell => {
  return {
    id: getId(pos),
    idx,
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

const placeMine = (board: Board) => {
  let pos: number;
  do {
    pos = random(1, board.size.x * board.size.y) - 1;
  } while (isMineCell(board.cells[pos]));
  board.cells[pos].type = CellType.mine;
  board.bombs.push(pos);
};

const placeMines = (board: Board, bombs: number) => {
  for (let i = 0; i < bombs; i++) {
    placeMine(board);
  }
};

const forCellsAround = <T = any>(
  cell: Cell,
  { cells, size }: Board,
  callback: (cell: Cell) => T
): T[] => {
  const values = [] as T[];

  // Top Row
  if (cell.pos.y !== 0) {
    // Top Left
    if (cell.pos.x !== 0) values.push(callback(cells[cell.idx - size.x - 1]));

    // Top Middle
    values.push(callback(cells[cell.idx - size.x]));

    // Top Right
    if (size.x - 1 > cell.pos.x)
      values.push(callback(cells[cell.idx - size.x + 1]));
  }

  // Middle Row
  // Middle Left
  if (cell.pos.x !== 0) values.push(callback(cells[cell.idx - 1]));

  // Middle Right
  if (size.x - 1 > cell.pos.x) values.push(callback(cells[cell.idx + 1]));

  // Bottom Row
  if (size.y - 1 > cell.pos.y) {
    // Bottom Left
    if (cell.pos.x !== 0) values.push(callback(cells[cell.idx + size.x - 1]));

    // Bottom Middle
    values.push(callback(cells[cell.idx + size.x]));

    // Bottom Right
    if (size.x - 1 > cell.pos.x)
      values.push(callback(cells[cell.idx + size.x + 1]));
  }

  return values;
};

const countMinesAround = (cell: Cell, board: Board): number =>
  forCellsAround(cell, board, (cell) => isMineCell(cell)).filter(Boolean)
    .length;

const countFlagsAround = (cell: Cell, board: Board): number =>
  forCellsAround(cell, board, (cell) => cell.flagged).filter(Boolean).length;

const numberCell = (cell: Cell, board: Board): Cell => {
  const mines = countMinesAround(cell, board);

  if (mines === 0) {
    return {
      ...cell,
      type: CellType.empty,
    };
  }

  return {
    ...cell,
    type: CellType.number,
    number: mines,
  };
};

const placeNumberCells = (board: Board) => {
  for (let i = 0; i < board.cells.length; i++) {
    const cell = board.cells[i];
    if (cell.type === CellType.mine) continue;

    board.cells[i] = numberCell(cell, board);
  }
};

export const newBoard = (
  x: number = 9,
  y: number = 9,
  bombs: number = 10
): Board => {
  const total = x * y;
  if (bombs > total) bombs = total;

  const board: Board = {
    cells: emptyBoard({ x, y }),
    size: {
      x,
      y,
    },
    bombs: [],
    first: true,
    left: bombs,
    state: State.playing,
  };
  placeMines(board, bombs);
  placeNumberCells(board);

  return board;
};

const getCell = (cells: Cells, id: string): Cell => {
  return cells.find((cell) => cell.id === id)!;
};

const setCellRevealed = (cell: Cell, cells: Cells) => {
  cells[cell.idx] = { ...cell, revealed: true };
};

const firstCellWasMine = (cell: Cell, board: Board): boolean => {
  if (board.size.x * board.size.y === board.bombs.length) return true;

  // place new mine
  placeMine(board);

  // remove old mine
  board.cells[cell.idx] = { ...cell, type: CellType.empty };
  cell = board.cells[cell.idx];
  const bombIdx = board.bombs.findIndex((bomb) => cell.idx === bomb);
  board.bombs.splice(bombIdx, 1);

  // recalculate mine numbers
  placeNumberCells(board);
  board.cells[cell.idx] = numberCell(cell, board);
  cell = board.cells[cell.idx];

  // clear first status
  board.first = false;

  // reveal the cell now
  return revealCell(cell, board);
};

const revealCell = (cell: Cell, board: Board): boolean => {
  if (cell.flagged) return false;

  if (cell.type === CellType.mine) {
    if (board.first) {
      return firstCellWasMine(cell, board);
    }

    return true;
  }

  if (cell.revealed) return false;
  board.first = false;

  setCellRevealed(cell, board.cells);

  if (cell.type === CellType.empty) {
    return forCellsAround(cell, board, (cell) => revealCell(cell, board)).some(
      (val) => val
    );
  }

  return false;
};

const lostGame = (board: Board) => {
  board.bombs.forEach((bomb) =>
    setCellRevealed(board.cells[bomb], board.cells)
  );
  board.state = State.lost;
};

const checkForWin = (board: Board) => {
  if (
    board.cells.length - board.cells.filter((cell) => cell.revealed).length ===
    board.bombs.length
  )
    board.state = State.won;
};

const copyBoard = (board: Board): Board => ({
  ...board,
  cells: [...board.cells],
  bombs: [...board.bombs],
});

export const revealCells = (prevState: Board, payload: string): Board => {
  const board = copyBoard(prevState);

  const cell = getCell(board.cells, payload);
  const isBomb = revealCell(cell, board);

  if (isBomb) {
    lostGame(board);
    return board;
  }

  checkForWin(board);

  return board;
};

const toggleCellFlag = (cell: Cell, board: Board) => {
  if (!cell.flagged) {
    board.cells[cell.idx] = { ...cell, flagged: true };
    board.left--;
  } else {
    board.cells[cell.idx] = { ...cell, flagged: false };
    board.left++;
  }
};

export const flagCell = (prevState: Board, payload: string): Board => {
  const board = copyBoard(prevState);

  const cell = getCell(board.cells, payload);
  toggleCellFlag(cell, board);

  return board;
};

export const safeRevealCells = (prevState: Board, payload: string): Board => {
  const board = copyBoard(prevState);

  const cell = getCell(board.cells, payload);
  const mines = countMinesAround(cell, board);
  const flags = countFlagsAround(cell, board);
  if (flags !== mines) return board;

  const list = forCellsAround(cell, board, (cell) => revealCell(cell, board));

  if (list.some((bomb) => bomb)) {
    lostGame(board);
    return board;
  }

  checkForWin(board);

  return board;
};
