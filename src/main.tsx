import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "highlight.js/styles/atom-one-dark.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
