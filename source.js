/**
 * setup player name
 * piece assignment should be done in button eventlistener
 */
const createPlayer = function(playerName, gamePiece, isAI) {
    // assign X || O
    // based off that  determine board piece?
    let getPiece = () => { return gamePiece; }
    let getName = () => { return playerName; }
    let getAI = () => { return isAI; }
    return {
        getName,
        getPiece,
        getAI
    }
}
let gameBoard = (function() {
    let board = new Array(9).fill(-1);      // initalize board w/ empty tiles
    let winningCombos = [
        [0,1,2], [0,3,6], [0,4,8],
        [1,4,7], [2,5,8], [3,4,5],
        [2,4,6], [6,7,8]
    ];
    let resetBoard = () => {
        board.fill(-1);
    }
    let setTile = (index, player) => {      // player selects tile
        board[index] = player.getPiece();   // mark tile
        console.log(checkWinner(player));
        if (checkWinner(player)) {                // check if player won
            // update the displayController
            // displayController needs a win function
            displayController.playerWon(player);
            console.log('won');
            return;
        } else {                            // change turns
            console.log('switching turns');
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
        let isWinner = false;
        winningCombos.forEach( (combo) => {
            if (board[combo[0]] === player.getPiece() &&
                board[combo[1]] === player.getPiece() &&
                board[combo[2]] === player.getPiece()) {
                    console.log(board[combo[0]] + ' ' + board[combo[1]] + ' ' + board[combo[2]]);
                    isWinner = true;
                }
        });
        console.log('failed out here');
        return isWinner;
    }
    let getBoard = () => { return board; }
    return {
        resetBoard,
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

    // let player1 = null;
    // let player2 = null;
    let player2 = createPlayer('mark', 'O', false);
    let player1 = createPlayer('alex', 'X', false);
    let playerTurn = player1;
    let getTurn = () => { return playerTurn; }
    let switchTurn = () => {        
        playerTurn = (playerTurn === player1) ? player2 : player1;
    }
    let playerWon = (player) => {
        console.log(player.getName() + ' WOOOOON');
        // update UI
        // freeze UI besides reset button
        freezeTiles();
    }
    let tie = () => {
        console.log('tie!');
        // update UI
        // freeze UI besides reset button
        freezeTiles();
    }
    
    return {
        getTurn,
        switchTurn,
        playerWon,
        tie
    }
})();

function resetTiles() {
    gameBoard.resetBoard();
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach( (tile) => {
        tile.textContent = '';
    });
}

function freezeTiles() {
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach( (tile) => {
        tile.removeEventListener('click', markTile);
    });
}

function markTile() {
    if (!this.textContent) {
        this.textContent = displayController.getTurn().getPiece();
        gameBoard.setTile(this.id, displayController.getTurn());    
    }
}

function initializeTiles() {
    let tiles = Array.from(document.querySelectorAll('.tile'));
    let tileNum = 0;
    tiles.forEach( (tile) => {
        tile.id = tileNum;
        tileNum += 1;
        tile.addEventListener('click', markTile);
    });    
}

document.querySelector('.reset-button').addEventListener('click', resetTiles);

initializeTiles();