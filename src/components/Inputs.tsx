import React, { useState } from "react";
import { newBoardAction, useBoard } from "../gamestate";
import { useTimer } from "../timer";

interface InputHook<T> {
  value: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function useInput<T>(initial: T, number = false): InputHook<T> {
  const [value, setValue] = useState<T>(initial);

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(number ? parseInt(e.target.value, 10) : (e.target.value as any)),
  };
}

interface InputProps extends InputHook<any> {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input
        className="ml-2 w-12 text-center rounded dark:bg-gray-900"
        {...props}
      />
    </div>
  );
};

export const Inputs = () => {
  const x = useInput(9, true);
  const y = useInput(9, true);
  const bombs = useInput(10, true);
  const board = useBoard();
  const timer = useTimer();

  const newBoard = () => {
    timer.clear();
    board.dispatch(newBoardAction(x.value, y.value, bombs.value));
  };

  return (
    <div className="flex flex-col items-center w-full md:flex-row md:w-1/6">
      <div className="flex justify-around w-full">
        <Input id="x" label="X:" type="number" {...x} />
        <Input id="y" label="Y:" type="number" {...y} />
        <Input id="bombs" label="Bombs:" type="number" {...bombs} />
      </div>
      <button
        className="bg-white m-2 w-1/3 rounded dark:bg-gray-900"
        onClick={newBoard}
      >
        New Board
      </button>
    </div>
  );
};
