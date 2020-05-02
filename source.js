/** 
 Setup:
     2 players
     1 game board 
     9 tiles

Logic:
    1. initalize board w/ empty 'tiles'     X
    2. setup players w/ names and pieces    X
    3. start game

game:
    1. player selects tile                  X
    2. mark tile                            X
    3. check if player won                  X
        3a. end game if won                 TODO
    4. change turns                         X
    5. repeat 1-4 (user driven)
    6. all tiles filled
        6a. tie
        6b. requires user reset
*/


let gameBoard = (function() {
    let board = new Array(9).fill(-1);      // initalize board w/ empty tiles
    let setTile = (index, player) => {      // player selects tile
        board[index] = player.getPiece();   // mark tile
        if (checkWinner(player)) {                // check if player won
            // update the displayController
            // displayController needs a win function
            console.log(todo);
            displayController.playerWon(player);
            return;
        } else {                            // change turns
            displayController.switchTurn();
        }
        checkBoard();
    }
    let checkBoard = () => {
        if (!board.includes(-1)) displayController.tie();
    }
    let checkWinner = (player) => {         // check if player won
        // end game if won?
        // change turns
        // called every time a piece is placed
        // iterate board to check if player won
        console.log('todo');
        return false;
    }
    let getBoard = () => { return board; }
    return {
        getBoard,
        setTile,
        checkWinner
    }
})();

/*
Utilizes the gameboard and players
Updates DOM
*/
let displayController = (function() { // basically the game controller

    let player1 = null;
    let player2 = null;
    let playerTurn = player1;
    let getTurn = () => { return playerTurn; }
    let switchTurn = () => {                            // switch turn
        playerTurn = (playerTurn === player1) ? player2 : player1;
    }
    let playerWon = (player) => {
        console.log(player.getName + ' WOOOOON');
        // update UI
        // freeze UI besides reset button
    }
    let tie = () => {
        console.log('tie!');
        // update UI
        // freeze UI besides reset button
    }
    
    return {
        getTurn,
        switchTurn,
        playerWon,
        tie
    }
})();

/**
 * setup player name
 * piece assignment should be done in button eventlistener
 */
const createPlayer = function(name, piece, isAI) {
    // assign X || O
    // based off that  determine board piece?
    this.playerName = name;
    this.AI = isAI;
    this.gamePiece = piece;
    let getPiece = () => { return gamePiece; }
    let getName = () => { return playerName; }
    let getAI = () => { return this.AI; }
    return {
        getName,
        getPiece,
        getAI
    }
}
