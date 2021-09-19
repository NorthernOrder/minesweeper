import React from "react";
import { useBoard } from "../gamestate";
import { State } from "../types";

export const Status = () => {
  const board = useBoard();

  return (
    <div className="flex pb-1">
      <p className="flex flex-grow justify-center gap-2 py-1">
        <span>Bombs Left:</span>
        <span className="bg-white w-8 text-center rounded dark:bg-gray-900">
          {board.value.left}
        </span>
      </p>
    </div>
  );
};
