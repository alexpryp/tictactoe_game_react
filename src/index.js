import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';


//additional functions and data------------------------------------------------
const winnerCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function calculateWinner(squares, winnerCombinations) {
    const winComb = winnerCombinations;

    for (let i = 0; i < winComb.length; i++) {
        const [a, b, c] = winComb[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], winComb[i]];
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

//Components-------------------------------------------------------------------
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
            gameWithComputer: true,
            levelOfDifficulty: 'light',
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        this.removeHighlightOfSquare();

        const numOfSquare = i;
        const arrNumOfSquare = this.state.movesArray.slice();
        arrNumOfSquare.push(numOfSquare);

        if (calculateWinner(squares, winnerCombinations)[0] || squares[i]) {
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

    enableGameWithComputer(levelOfDifficulty) {
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
            levelOfDifficulty: levelOfDifficulty,
        });

        document.querySelector('.player-vs-player').classList.remove('player-active');

        const playerVsComputerLight = document.querySelector('.player-vs-computer-light');
        const playerVsComputerMedium = document.querySelector('.player-vs-computer-medium');
        const playerVsComputerHard = document.querySelector('.player-vs-computer-hard');

        if (levelOfDifficulty === 'light') {
            playerVsComputerLight.classList.add('player-active');
            playerVsComputerMedium.classList.remove('player-active');
            playerVsComputerHard.classList.remove('player-active');
        } else if (levelOfDifficulty === 'medium') {
            playerVsComputerLight.classList.remove('player-active');
            playerVsComputerMedium.classList.add('player-active');
            playerVsComputerHard.classList.remove('player-active');
        } else if (levelOfDifficulty === 'hard') {
            playerVsComputerLight.classList.remove('player-active');
            playerVsComputerMedium.classList.remove('player-active');
            playerVsComputerHard.classList.add('player-active');
        }
        this.removeHighlightWinnerSquare();
        this.removeHighlightOfSquare();
    }

    enableGameWithPlayer(levelOfDifficulty) {
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
            levelOfDifficulty: levelOfDifficulty,
        });

        document.querySelector('.player-vs-computer-light').classList.remove('player-active');
        document.querySelector('.player-vs-computer-medium').classList.remove('player-active');
        document.querySelector('.player-vs-computer-hard').classList.remove('player-active');
        document.querySelector('.player-vs-player').classList.add('player-active');
        this.removeHighlightWinnerSquare();
        this.removeHighlightOfSquare();
    }

    computerMove(handleClick) {
        if (this.state.gameWithComputer) {
            if (!this.state.xIsNext) {
                let current = this.state.history[this.state.history.length - 1].squares;
                let charInCells = [];
                let moveDone = false;

                winnerCombinations.forEach(
                    function(item) {
                        let numberOfX = 0;
                        let numberOfO = 0;
                        let numberOfNulls = 0;

                        for (let i = 0; i < 3; i++) {
                            if (current[item[i]] === "X") {
                                numberOfX += 1;
                            } else if (current[item[i]] === "O") {
                                numberOfO += 1;
                            } else if (current[item[i]] === null) {
                                numberOfNulls += 1;
                            }
                        }
                        charInCells.push([numberOfX, numberOfO, numberOfNulls]);
                    }
                );
                
                charInCells.forEach(
                    function(item, index, array) {
                            if (item[0] === 0 && item[1] === 2 && item[2] === 1) {
                                for (let i = 0; i < 3; i++) {
                                    if (current[winnerCombinations[index][i]] === null) {
                                        handleClick(winnerCombinations[index][i]);
                                        moveDone = true;
                                    }
                                }
                            }
                    }
                );

                if (moveDone === true) {
                    return;
                }

                if (this.state.levelOfDifficulty === 'medium' || this.state.levelOfDifficulty === 'hard') {
                    charInCells.forEach(
                        function(item, index, array) {
                                if (item[0] === 2 && item[1] === 0 && item[2] === 1) {
                                    for (let i = 0; i < 3; i++) {
                                        if (current[winnerCombinations[index][i]] === null) {
                                            handleClick(winnerCombinations[index][i]);
                                            moveDone = true;
                                        }
                                    }
                                }
                        }
                    );
                }

                if (moveDone === true) {
                    return;
                }

                if (this.state.levelOfDifficulty === 'hard') {
                    charInCells.forEach(
                        function(item, index, array) {
                                if (item[0] === 1 && item[1] === 0 && item[2] === 2) {
                                    for (let i = 0; i < 3; i++) {
                                        if (current[winnerCombinations[index][i]] === null) {
                                            handleClick(winnerCombinations[index][i]);
                                            moveDone = true;
                                        }
                                    }
                                }
                        }
                    );
                }

                if (moveDone === true) {
                    return;
                }

                charInCells.forEach(
                    function(item, index, array) {
                            if (item[0] === 0 && item[1] === 1 && item[2] === 2) {
                                for (let i = 0; i < 3; i++) {
                                    if (current[winnerCombinations[index][i]] === null) {
                                        handleClick(winnerCombinations[index][i]);
                                        moveDone = true;
                                    }
                                }
                            }
                    }
                );

                if (moveDone === true) {
                    return;
                }

                charInCells.forEach(
                    function(item, index, array) {
                            if (item[0] === 0 && item[1] === 0 && item[2] === 3) {
                                for (let i = 0; i < 3; i++) {
                                    if (current[winnerCombinations[index][i]] === null) {
                                        handleClick(winnerCombinations[index][i]);
                                        moveDone = true;
                                    }
                                }
                            }
                    }
                );

                if (moveDone === true) {
                    return;
                }

                charInCells.forEach(
                    function(item, index, array) {
                        for (let i = 0; i < 3; i++) {
                            if (current[winnerCombinations[index][i]] === null) {
                                handleClick(winnerCombinations[index][i]);
                                moveDone = true;
                            }
                        }
                    }
                );
            }
        }
    }

    componentDidUpdate() {
        this.computerMove(this.handleClick);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, winnerCombinations)[0];
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
            const arrayWinner = calculateWinner(current.squares, winnerCombinations)[1];

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
                        <button className="player-vs-computer-light player-active" onClick={() => this.enableGameWithComputer('light')}>
                            Легкий
                        </button>
                        <button className="player-vs-computer-medium" onClick={() => this.enableGameWithComputer('medium')}>
                            Средний
                        </button>
                        <button className="player-vs-computer-hard" onClick={() => this.enableGameWithComputer('hard')}>
                            Сложный
                        </button>
                        <button className="player-vs-player" onClick={() => this.enableGameWithPlayer(null)}>
                            Игра с другом
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


serviceWorker.unregister();
