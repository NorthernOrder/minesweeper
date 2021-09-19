import React, { ReactNode, useEffect, useState } from "react";
import { TheBoard } from "./components/Board";
import { Inputs } from "./components/Inputs";
import { BackdropProps, Modal } from "./components/Modal";
import { Status } from "./components/Status";
import { Timer } from "./components/Timer";
import { BoardProvider, useBoard } from "./gamestate";
import { TimerProvider } from "./timer";
import { State } from "./types";

function Header() {
  return (
    <header className="w-full flex flex-col items-center justify-center py-3 px-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 md:flex-row md:gap-2">
      <Inputs />
      <div className="md:flex-grow"></div>
      <Timer />
      <Status />
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
      © Northern Order {new Date().getFullYear()}
    </footer>
  );
}

function Backdrop({ children }: BackdropProps) {
  return (
    <div
      style={{
        backgroundColor: "#00000066",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
}

function Page() {
  const [open, setOpen] = useState(false);
  const {
    value: { state },
  } = useBoard();

  useEffect(() => {
    if (state !== State.playing) {
      setOpen(true);
    }
  }, [state]);

  const close = () => setOpen(false);

  return (
    <div className="min-h-screen grid layout dark:bg-gray-900">
      <Header />
      <TheBoard />
      <Modal onOutsideClick={close} Backdrop={Backdrop} open={open}>
        <div
          className="flex items-center justify-center min-h-screen min-w-screen w-screen h-screen"
          onClick={close}
        >
          <div className="bg-gray-200 p-8 rounded text-center opacity-90 dark:bg-gray-700 dark:text-gray-300">
            <h2 className="text-3xl mb-8">
              {state === State.won ? "🎉 You won! 🎉" : "🙁 You lost! 🙁"}
            </h2>
            <p>Click to continue</p>
          </div>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BoardProvider>
      <TimerProvider>
        <Page />
      </TimerProvider>
    </BoardProvider>
  );
}

export default App;
