export enum CellType {
  empty,
  number,
  mine,
}

export enum State {
  playing,
  won,
  lost,
}

export interface Point {
  x: number;
  y: number;
}

export interface Cell {
  id: number;
  pos: Point;
  type: CellType;
  number?: number;
  revealed: boolean;
  flagged: boolean;
}

export type Cells = Cell[];

export interface Board {
  cells: Cells;
  size: Point;
  bombs: number;
  first: boolean;
  left: number;
  state: State;
}
