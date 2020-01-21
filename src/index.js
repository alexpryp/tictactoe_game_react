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
            gameWithComputer: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        this.removeHighlightOfSquare();

        const numOfSquare = i;
        const arrNumOfSquare = this.state.movesArray.slice();
        arrNumOfSquare.push(numOfSquare);

        if (calculateWinner(squares)[0] || squares[i]) {
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
        this.removeHighlightWinnerSquare();
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

    removeHighlightOfSquare() {
        const gameBoard = document.getElementsByClassName('game-board')[0];
        const highlightedSquare = gameBoard.getElementsByClassName('highlighted-square')[0];
        
        if (highlightedSquare) {
            highlightedSquare.classList.remove('highlighted-square');
        }
    }

    highlightWinnerSquare(winnerArrey) {
        const gameBoard = document.getElementsByClassName('game-board')[0];
        const allSquaresArr = gameBoard.getElementsByClassName('square');

        for (let i = 0; i < allSquaresArr.length; i++) {
            for (let j = 0; j < winnerArrey.length; j++) {
                if (i === winnerArrey[j]) {
                    allSquaresArr[i].classList.add('highlighted-winner-square');
                }
            }
        }
    }

    removeHighlightWinnerSquare() {
        const gameBoard = document.getElementsByClassName('game-board')[0];
        const highlightedSquares = Array.from(gameBoard.getElementsByClassName('highlighted-winner-square'));

        if (highlightedSquares[0]) {
            for(let i = 0; i < highlightedSquares.length; i++) {
                highlightedSquares[i].classList.remove('highlighted-winner-square');
            }
        }
    }

    enableGameWithComputer() {
        this.setState({
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
            gameWithComputer: true,
        });

        document.querySelector('.player-vs-player').classList.remove('player-active');
        document.querySelector('.player-vs-computer').classList.add('player-active');
    }

    enableGameWithPlayer() {
        this.setState({
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
            gameWithComputer: false,
        });

        document.querySelector('.player-vs-computer').classList.remove('player-active');
        document.querySelector('.player-vs-player').classList.add('player-active');
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)[0];
        let sequenceOfSteps = "Сортировать ходы по убыванию";

        let moves = history.map((step, move) => {
            const desc = move ?
                `Перейти к ходу № ${move} (Кол: ${getCoord(this.state.movesArray[move - 1])[0]}, Cтр: ${getCoord(this.state.movesArray[move - 1])[1]})` :
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
            const arrayWinner = calculateWinner(current.squares)[1];

            this.highlightWinnerSquare(arrayWinner);
            status = 'Выиграл ' + winner;
        } else if (freeCellCheck(current.squares)) {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            status = 'Ничья';
        }

        return (
            <div className="game">
                <div className="type-of-game">
                    <h3>ВЫБЕРИТЕ РЕЖИМ ИГРЫ:</h3>
                    <div className="type-of-game-buttons">
                        <button className="player-vs-player player-active" onClick={() => this.enableGameWithPlayer()}>
                            Игрок-1 : Игрок-2
                        </button>
                        <button className="player-vs-computer" onClick={() => this.enableGameWithComputer()}>
                            Игрок-1 : Компьютер
                        </button>
                    </div>
                </div>
                <div className="new-game">
                    <button className="new-game-button" onClick={() => this.jumpTo(0)}>Новая Игра</button>
                </div>
                <div className="game-status">{status}</div>
                <div className="game-main">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <h3>ИСТОРИЯ ХОДОВ</h3>
                        <button className="sorting" onClick={() => this.setState({
                            ascendingSequence: !this.state.ascendingSequence,
                        })}>{sequenceOfSteps}</button>
                        <ol>{moves}</ol>
                    </div>
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
            return [squares[a], lines[i]];
        }
    }
    return [null];
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

function freeCellCheck(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return true;
        }
    }
    return false;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
