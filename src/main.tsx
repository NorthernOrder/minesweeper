import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

document.addEventListener("mousedown", (e1) => {
  if (e1.button === 1) {
    e1.preventDefault();
    const listener = (e2: MouseEvent) => {
      if (e1.target === e2.target) {
        e2.preventDefault();
        e2.target?.dispatchEvent(new Event("middleclick"));
        document.removeEventListener("mouseup", listener);
      }
      return false;
    };
    document.addEventListener("mouseup", listener);
    return false;
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
