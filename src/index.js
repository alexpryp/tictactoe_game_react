import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';







function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(i) {
        return (
            <div className="board-row">
                {this.renderSquare(i)}
                {this.renderSquare(i + 1)}
                {this.renderSquare(i + 2)}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderRow(0)}
                {this.renderRow(3)}
                {this.renderRow(6)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { 
                    squares: Array(9).fill(null),
                    changedSquare: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            movesArray: [],
            highlightedMove: null,
            ascendingSequence: true,
        };
    }

    removeHighlightOfSquare() {
        const gameBoard = document.getElementsByClassName('game-board')[0];
        const highlightedSquare = gameBoard.getElementsByClassName('highlighted-square')[0];
        
        if (highlightedSquare) {
            highlightedSquare.classList.remove('highlighted-square');
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        this.removeHighlightOfSquare();

        const numOfSquare = i;
        const arrNumOfSquare = this.state.movesArray.slice();
        arrNumOfSquare.push(numOfSquare);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                changedSquare: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            movesArray: arrNumOfSquare,
        });
    }

    jumpTo(step) {
        this.removeHighlightOfSquare();

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
        this.highlightSquare(step);
    }

    highlightSquare(step) {
        if (step < 1) {
            return;
        }
        const gameBoard = document.getElementsByClassName('game-board')[0];
        const allSquaresArr = gameBoard.getElementsByClassName('square');
        const changedSquare = allSquaresArr[this.state.history[step].changedSquare];

        changedSquare.classList.add('highlighted-square');
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let sequenceOfSteps = "Сортировать ходы по убыванию";

        let moves = history.map((step, move) => {
            const desc = move ?
                `Перейти к ходу № ${move} (Колонка ${getCoord(this.state.movesArray[move - 1])[0]}, строка ${getCoord(this.state.movesArray[move - 1])[1]})` :
                'К началу игры';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (!this.state.ascendingSequence) {
            moves = moves.reverse();
            sequenceOfSteps = "Сортировать ходы по возрастанию";
        }

        let status;
        if (winner) {
            status = 'Выиграл ' + winner;
        } else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.setState({
                        ascendingSequence: !this.state.ascendingSequence,
                    })}>{sequenceOfSteps}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}

function getCoord(numb) {
    //in coord array:
    //first number - number of columns;
    //second number: number of rows;
    //third number: number of squares;
    const coord = [
        [1, 1, 0],
        [2, 1, 1],
        [3, 1, 2],
        [1, 2, 3],
        [2, 2, 4],
        [3, 2, 5],
        [1, 3, 6],
        [2, 3, 7],
        [3, 3, 8],
    ];

    return coord[numb];
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
