import React, { ReactElement, ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface OverlayProps {
  children: ReactNode;
  onOutsideClick?: () => void;
}

const Overlay = ({ children, onOutsideClick }: OverlayProps) => {
  return (
    <div
      onClick={onOutsideClick}
      style={{
        backgroundColor: "#00000000",
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
};

export interface BackdropProps {
  children: ReactNode;
}

interface ModalProps {
  open: boolean;
  Backdrop?: (props: BackdropProps) => ReactElement;
  children: ReactNode;
  onOutsideClick?: () => void;
}

export const Modal = ({
  children,
  Backdrop,
  onOutsideClick,
  open,
}: ModalProps) => {
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    const overlay = document.querySelector("#overlay")!;
    overlay.appendChild(el.current);

    return () => {
      overlay.removeChild(el.current);
    };
  }, []);

  if (!open) return null;

  if (Backdrop) {
    return ReactDOM.createPortal(
      <Backdrop>
        <Overlay onOutsideClick={onOutsideClick}>{children}</Overlay>
      </Backdrop>,
      el.current
    );
  }

  return ReactDOM.createPortal(
    <Overlay onOutsideClick={onOutsideClick}>{children}</Overlay>,
    el.current
  );
};
