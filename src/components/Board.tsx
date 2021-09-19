import React, { useMemo } from "react";
import { useBoard } from "../gamestate";
import { Cell } from "../types";
import { Row } from "./Row";

export const TheBoard = () => {
  const { value: board } = useBoard();
  const rows = useMemo(() => {
    const cells = [...board.cells];
    const rows: Cell[][] = [];
    for (let i = 0; i < board.size.y; i++) {
      rows.push(cells.splice(0, board.size.x));
    }
    return rows;
  }, [board]);

  return (
    <main className="flex flex-col items-center content-center h-full overflow-x-auto mt-8 p-4">
      {rows.map((row, i) => (
        <Row key={i} row={row} />
      ))}
    </main>
  );
};
