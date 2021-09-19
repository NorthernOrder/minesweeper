import React, { useContext } from "react";
import { createContext, Dispatch, useReducer } from "react";
import { revealCells, newBoard, flagCell, safeRevealCells } from "./board";
import { Board, State } from "./types";

enum BoardActions {
  clicked = "board/clicked",
  new = "board/new",
  flag = "board/flag",
  safe = "board/safe",
}

interface Action {
  type: BoardActions;
  payload: any;
}

interface Context {
  value: Board;
  dispatch: Dispatch<Action>;
}

const StateContext = createContext<Context>({} as any);

export const revealCellAction = (id: string): Action => ({
  type: BoardActions.clicked,
  payload: id,
});

export const newBoardAction = (
  x: number,
  y: number,
  bombs: number
): Action => ({
  type: BoardActions.new,
  payload: [x, y, bombs],
});

export const flagCellAction = (id: string): Action => ({
  type: BoardActions.flag,
  payload: id,
});

export const safeRevealAction = (id: string): Action => ({
  type: BoardActions.safe,
  payload: id,
});

const reducer = (state: Board, action: Action): Board => {
  if (state.state !== State.playing && action.type !== BoardActions.new)
    return state;

  switch (action.type) {
    case BoardActions.clicked:
      return revealCells(state, action.payload);
    case BoardActions.flag:
      return flagCell(state, action.payload);
    case BoardActions.safe:
      return safeRevealCells(state, action.payload);
    case BoardActions.new:
      return newBoard(...action.payload);
    default:
      return state;
  }
};

export const BoardProvider: React.FC = (props) => {
  const [value, dispatch] = useReducer(reducer, newBoard());

  return (
    <StateContext.Provider value={{ value, dispatch }}>
      {props.children}
    </StateContext.Provider>
  );
};

export const useBoard = () => {
  return useContext(StateContext);
};
