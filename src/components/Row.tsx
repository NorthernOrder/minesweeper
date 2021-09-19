import React from "react";
import { Cell as CellProps } from "../types";
import { Cell } from "./Cell";

export const Row = ({ row }: { row: CellProps[] }) => {
  return (
    <div className="flex flew-row">
      {row.map((space) => (
        <Cell key={space.id} cell={space} />
      ))}
    </div>
  );
};
