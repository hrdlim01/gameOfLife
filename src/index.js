import React from "react";
import ReactDOM from "react-dom";
import nextFlat from "./gol.js";

import "./styles.css";

const defaultRows = 15;
const defaultColumns = 15;

function Dimension(props) {
  return (
    <>
      <div>
        {props.name}: {props.value}
      </div>
      <button onClick={props.decrease}>{"<"}</button>
      <button onClick={props.increase}>{">"}</button>
    </>
  );
}

function Setup(props) {
  return (
    <div className="setup">
      <div>Dimensions:</div>
      <Dimension
        name="Rows"
        value={props.rows}
        increase={() => props.increaseRow()}
        decrease={() => props.decreaseRow()}
      />

      <Dimension
        name="Columns"
        value={props.columns}
        increase={() => props.increaseColumn()}
        decrease={() => props.decreaseColumn()}
      />
    </div>
  );
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: props.boardSquares
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.boardSquares[i] & 1 ? "o" : ""} //Is the value odd or even
        onClick={() => this.props.handleClick(i)}
      />
    );
  }

  renderRow(startIndex, columnsNumber) {
    let allSquares = Array(this.props.columns)
      .fill(0)
      .map((item, index) => this.renderSquare(startIndex + index));
    return <div className="board-row">{allSquares}</div>;
  }

  render() {
    let allRows = Array(this.props.rows)
      .fill(0)
      .map((item, index) =>
        this.renderRow(index * this.props.columns, this.props.columns)
      );
    return (
      <div>
        <div>Board</div>
        {allRows}
      </div>
    );
  }
}

class Control extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.nextIteration();
          }}
        >
          {"Next >>"}
        </button>
        <button
          onClick={() => {
            this.props.reset();
          }}
        >
          {"Reset"}
        </button>
        <button
          onClick={() => {
            this.props.play();
          }}
        >
          {"Play"}
        </button>
        <button
          onClick={() => {
            this.props.stop();
          }}
        >
          {"Stop"}
        </button>
      </div>
    );
  }
}

class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: defaultRows,
      columns: defaultColumns,
      boardSquares: Array(defaultRows * defaultColumns).fill(0),
      generation: 0,
      timer: 0
    };
  }

  increaseRows() {
    let value = this.state.rows;
    value++;
    this.setState({ rows: value });
    this.setState({ boardSquares: Array(value * this.state.columns).fill(0) });
  }

  decreaseRows() {
    let value = this.state.rows;
    value--;
    this.setState({ rows: value });
    this.setState({ boardSquares: Array(value * this.state.columns).fill(0) });
  }

  increaseColumns() {
    let value = this.state.columns;
    value++;
    this.setState({ columns: value });
    this.setState({ boardSquares: Array(this.state.rows * value).fill(0) });
  }

  decreaseColumns() {
    let value = this.state.columns;
    value--;
    this.setState({ columns: value });
    this.setState({ boardSquares: Array(this.state.rows * value).fill(0) });
  }

  handleClick(i) {
    const squares = this.state.boardSquares.slice();
    if (squares[i] === 0) {
      squares[i] = 1;
    } else {
      squares[i] = 0;
    }
    this.setState({ boardSquares: squares });
  }

  nextIteration() {
    this.setState({
      boardSquares: nextFlat(this.state.boardSquares, this.state.columns)
    });
    this.setState({ generation: this.state.generation + 1 });
  }

  reset() {
    this.setState({ generation: 0 });
    this.setState({ rows: defaultRows });
    this.setState({ columns: defaultColumns });
    this.setState({
      boardSquares: Array(defaultRows * defaultColumns).fill(0)
    });
  }

  play() {
    if (this.state.timer === 0) {
      let timerId = setInterval(() => this.nextIteration(), 1000);
      this.setState({ timer: timerId });
    }
  }

  stop() {
    clearInterval(this.state.timer, 0);
    this.setState({ timer: 0 });
  }

  renderSetup() {
    return (
      <Setup
        rows={this.state.rows}
        columns={this.state.columns}
        increaseRow={() => this.increaseRows()}
        decreaseRow={() => this.decreaseRows()}
        increaseColumn={() => this.increaseColumns()}
        decreaseColumn={() => this.decreaseColumns()}
      />
    );
  }

  renderBoard() {
    return (
      <Board
        rows={this.state.rows}
        columns={this.state.columns}
        boardSquares={this.state.boardSquares}
        handleClick={i => this.handleClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="gameOfLife">
        <div className="game-setup">{this.renderSetup()}</div>
        <div className="game-board">{this.renderBoard()}</div>
        <div className="game-control">
          <Control
            nextIteration={() => this.nextIteration()}
            reset={() => this.reset()}
            play={() => this.play()}
            stop={() => this.stop()}
          />
        </div>
        <div>Generation: {this.state.generation}</div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<GameOfLife />, rootElement);
