import React from "react";
import ReactDOM from "react-dom";
import GameOfLife from "./components/GameOfLife"

import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(<GameOfLife />, rootElement);
