import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className={`square ${props.isHilight}`} onClick={props.onClick} >
      {props.value}
    </button>
  )
}
// 3問目追加 liが降順になるように
function MoveList(props) {
    if (props.historyOrder === 'asc') {
      return (
        <ol>{props.renderMoves}</ol>
        )
    } else {
      return (
        <ol reversed>{props.renderMoves}</ol>
      )
    }
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
      <Square 
        value={this.props.squares[i]}
        isHilight={this.judgeHilight(i) ? 'isHilight' : ''}
        onClick={() => this.props.onClick(i)}
      />
      );
    }
    judgeHilight(index) {
      return this.props.hilightSquare.includes(index);
    }
    render() {
      // 2問目
      const renderSquareArray = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ];
      const renderSquares = renderSquareArray.map((rowData, index) => {
        const row = rowData.map((square) => {
          return (
            this.renderSquare(square)
          )
        })
        
        return (
          <div key={index} className="board-row">
            {row}
          </div>
        )
      })
      return (
        <div>
          {renderSquares}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          currentSquare: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        historyOrder: 'asc',
        hilightSquare: null,
      };
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares)) {
        
        return;
      }
      if (squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          current: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }
    changeOrder() {
      this.setState({
        historyOrder: this.state.historyOrder === 'asc' ? 'desc' : 'asc',
      })
    }
    // 一問目
    getSquarePosition(i) {
      return [this.getSquareRow(i), this.getSquareCol(i)];
    }
    getSquareRow(i) {
      const surplus = i % 3;
      switch (surplus) {
        case 0:
          return 1;
        case 1:
          return 2;
        case 2:
          return 3;
        default:
          break;
      }
    }
    getSquareCol(i) {
      const result = i / 3;
      if (result < 1) {
        return 1;
      } else if (1 <= result && result < 2) {
        return 2;
      } else {
        return 3;
      }
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const position = this.getSquarePosition(step.current);
        const desc = move ?
        'Go to move #' + move + 'row :' +  position[0] + 'col : ' + position[1]: 'Go to start';
        return (
          <li key={move}>
            <button className={(move === this.state.stepNumber) ? 'bold' : ''} onClick ={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      // 3問目
      const renderMoves = this.state.historyOrder === 'asc' ? moves : moves.reverse();
      
      let status;
      let hilightSquare = [];
      if (winner) {
        status = 'Winner: ' + winner;
        hilightSquare = judgeGame(current.squares);
      } else if (!current.squares.includes(null)) {
        status = 'draw'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      const orderStatus = this.state.historyOrder === 'asc' ? '昇順' : '降順';
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              hilightSquare={hilightSquare}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button className="order-change" onClick={() => this.changeOrder()}>{orderStatus}</button>
            <MoveList
              renderMoves={renderMoves}
              historyOrder={this.state.historyOrder}
            />
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const result = judgeGame(squares);
    if (result) {
      return squares[result[0]];
    }
    return null;
  }

  function judgeGame(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }