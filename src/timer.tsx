import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBoard } from "./gamestate";
import { State } from "./types";

interface TimerContext {
  value: number;
  clear: () => void;
  start: () => void;
  stop: () => void;
}

const TimerContext = createContext<TimerContext>({
  value: 0,
  clear: () => null,
  start: () => null,
  stop: () => null,
});

export const TimerProvider: FC = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef(0);
  const intervalHandle = useRef(0);

  const callback = useCallback(() => {
    const current = Date.now();
    const ms = current - startTime.current;

    setSeconds(Math.floor(ms / 1000));
  }, [setSeconds]);

  const start = useCallback(() => {
    if (startTime.current !== 0) return;

    startTime.current = Date.now();
    intervalHandle.current = setInterval(callback, 100);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalHandle.current);
  }, []);

  const clear = useCallback(() => {
    stop();
    setSeconds(0);
    startTime.current = 0;
  }, [setSeconds]);

  const {
    value: { state },
  } = useBoard();

  useEffect(() => {
    if (state !== State.playing) {
      stop();
    }
  }, [state]);

  return (
    <TimerContext.Provider value={{ value: seconds, start, stop, clear }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
