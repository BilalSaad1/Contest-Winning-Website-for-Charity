import React, { useState } from 'react';
import "./connect4.css"

// Create a 2D array to represent the game board
const initialBoard = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
];

// Connect4 component
function Connect4() {
    const [board, setBoard] = useState([
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ]);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);


    // Function to check if a player has won
    function checkWin(player) {
        // Check rows
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col <= board[row].length - 4; col++) {
                if (
                    board[row][col] === player &&
                    board[row][col + 1] === player &&
                    board[row][col + 2] === player &&
                    board[row][col + 3] === player
                ) {
                    return true;
                }
            }
        }

        // Check columns
        for (let col = 0; col < board[0].length; col++) {
            for (let row = 0; row <= board.length - 4; row++) {
                if (
                    board[row][col] === player &&
                    board[row + 1][col] === player &&
                    board[row + 2][col] === player &&
                    board[row + 3][col] === player
                ) {
                    return true;
                }
            }
        }

        // Check diagonals (top-left to bottom-right)
        for (let row = 0; row <= board.length - 4; row++) {
            for (let col = 0; col <= board[row].length - 4; col++) {
                if (
                    board[row][col] === player &&
                    board[row + 1][col + 1] === player &&
                    board[row + 2][col + 2] === player &&
                    board[row + 3][col + 3] === player
                ) {
                    return true;
                }
            }
        }

        // Check diagonals (top-right to bottom-left)
        for (let row = 0; row <= board.length - 4; row++) {
            for (let col = 3; col < board[row].length; col++) {
                if (
                    board[row][col] === player &&
                    board[row + 1][col - 1] === player &&
                    board[row + 2][col - 2] === player &&
                    board[row + 3][col - 3] === player
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    // Function to make a move
    function makeMove(column) {
        if(gameOver) return;
        // Find the first available row in the selected column
        let row = null;
        for (let i = board.length - 1; i >= 0; i--) {
            if (board[i][column] === null) {
                row = i;
                break;
            }
        }

        // If the column is full, return without making a move
        if (row === null) {
            return;
        }

        // Update the board with the player's move
        const updatedBoard = [...board];
        updatedBoard[row][column] = currentPlayer;
        setBoard(updatedBoard);

        // Check if the current player has won
        if (checkWin(currentPlayer)) {
            setGameOver(true);
            setWinner(currentPlayer); // Set the winner
            console.log(`Player ${currentPlayer} wins!`);
            return;
        }

        // Switch to the next player
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    // Function to print the game board
    function printBoard() {
        for (let row = 0; row < board.length; row++) {
            console.log(board[row].join(' '));
        }
    }
    function resetGame() {
        setBoard([...initialBoard]); // Spread operator to create a new array
        setCurrentPlayer('X');
        setGameOver(false);
        setWinner(null);
    }

    // Example usage
    printBoard();

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>

        <div>
                <button id="reset" onClick={resetGame} style={{ margin: '20px', padding: '10px' }}>Restart Game</button>
            </div>
            {gameOver && <h2>{`Player ${winner} wins!`}</h2>}
            {!gameOver && <h2>{`Current Player: ${currentPlayer}`}</h2>}
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.map((cell, colIndex) => (
                    <div 
                        key={colIndex} 
                        onClick={() => makeMove(colIndex)}
                        style={{
                            width: '50px', 
                            height: '50px', 
                            backgroundColor: cell ? (cell === 'X' ? '#e8c6b0' : '#a18a9b') : 'white',
                            border: '1px solid black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: gameOver ? 'default' : 'pointer'
                        }}
                    >
                        {cell}
                    </div>
                ))}
            </div>
        ))}
    </div>
    )
}

export default Connect4;

