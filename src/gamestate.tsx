import React, { useContext } from "react";
import { createContext, Dispatch } from "react";
import { Reducer, useImmerReducer } from "use-immer";
import { flagCell } from "./board/flag";
import { newBoard } from "./board/newBoard";
import { revealCells } from "./board/reveal";
import { safeRevealCells } from "./board/safeReveal";
import { Board, State } from "./types";

enum BoardActions {
  reveal = "board/reveal",
  new = "board/new",
  flag = "board/flag",
  safe = "board/safe",
}

interface RevealAction {
  type: BoardActions.reveal;
  payload: number;
}

interface NewBoardAction {
  type: BoardActions.new;
  payload: {
    x: number;
    y: number;
    bombs: number;
  };
}

interface FlagAction {
  type: BoardActions.flag;
  payload: number;
}

interface SafeRevealAction {
  type: BoardActions.safe;
  payload: number;
}

type Action = RevealAction | NewBoardAction | FlagAction | SafeRevealAction;

interface Context {
  value: Board;
  dispatch: Dispatch<Action>;
}

const StateContext = createContext<Context>({} as any);

export const revealCellAction = (id: number): RevealAction => ({
  type: BoardActions.reveal,
  payload: id,
});

export const newBoardAction = (
  x: number,
  y: number,
  bombs: number
): NewBoardAction => ({
  type: BoardActions.new,
  payload: { x, y, bombs },
});

export const flagCellAction = (id: number): FlagAction => ({
  type: BoardActions.flag,
  payload: id,
});

export const safeRevealAction = (id: number): SafeRevealAction => ({
  type: BoardActions.safe,
  payload: id,
});

const checkForWin = (board: Board) => {
  if (
    board.cells.length - board.cells.filter((cell) => cell.revealed).length ===
    board.bombs
  )
    board.state = State.won;
};

const reducer: Reducer<Board, Action> = (draft, action) => {
  if (draft.state !== State.playing && action.type !== BoardActions.new) return;

  switch (action.type) {
    case BoardActions.reveal:
      revealCells(draft, action.payload);
      break;
    case BoardActions.flag:
      flagCell(draft, action.payload);
      break;
    case BoardActions.safe:
      safeRevealCells(draft, action.payload);
      break;
    case BoardActions.new:
      return newBoard(action.payload);
    default:
      break;
  }

  checkForWin(draft);
};

export const BoardProvider: React.FC = (props) => {
  const [value, dispatch] = useImmerReducer(reducer, newBoard());

  return (
    <StateContext.Provider value={{ value, dispatch }}>
      {props.children}
    </StateContext.Provider>
  );
};

export const useBoard = () => {
  return useContext(StateContext);
};
