import React from "react";
import { useTimer } from "../timer";

export const Timer = () => {
  const timer = useTimer();

  return (
    <p className="flex justify-center gap-2 pb-1">
      <span>Elapsed time:</span>
      <span className="bg-white w-8 text-center rounded dark:bg-gray-900">
        {timer.value}
      </span>
    </p>
  );
};
