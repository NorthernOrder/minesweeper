import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import {
  flagCellAction,
  revealCellAction,
  safeRevealAction,
  useBoard,
} from "../gamestate";
import { useTimer } from "../timer";
import { Cell as CellProps, CellType } from "../types";

const colors = [
  "blue",
  "green",
  "red",
  "purple",
  "maroon",
  "cyan",
  "black",
  "lightgray",
];

export const Cell = ({ cell }: { cell: CellProps }) => {
  const ref = useRef<HTMLButtonElement>();
  const { dispatch } = useBoard();
  const timer = useTimer();

  const onClick = () => {
    timer.start();
    dispatch(revealCellAction(cell.id));
  };

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell.revealed) return;

    dispatch(flagCellAction(cell.id));
  };

  useEffect(() => {
    if (!ref.current) return;

    const listener = () => {
      if (!cell.revealed || cell.type !== CellType.number) return;

      dispatch(safeRevealAction(cell.id));
    };

    ref.current.addEventListener("middleclick", listener);

    return () => ref.current?.removeEventListener("middleclick", listener);
  }, [ref, cell, dispatch]);

  let text = "";
  if (cell.flagged) text = "🚩";
  else if (!cell.revealed) text = "";
  else if (cell.type === CellType.mine) text = "💣";
  else if (cell.type === CellType.number) text = cell.number!.toString();

  return (
    <button
      className={clsx(
        "flex items-center justify-center border border-solid border-black w-8 h-8 font-extrabold text-xl",
        cell.revealed
          ? "bg-gray-300 dark:bg-gray-600"
          : "bg-gray-100 dark:bg-gray-500 cursor-pointer"
      )}
      style={{ color: colors[cell.number! - 1] }}
      ref={ref as any}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {text}
    </button>
  );
};
