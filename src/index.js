import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App"; // class component
//import App from "./App1"; // functional component
import WorkingApp from "./App2"; // functional component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WorkingApp />
  </React.StrictMode>
);
