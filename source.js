/**
 * setup player name
 * piece assignment should be done in button eventlistener
 */
const createPlayer = function(playerName, gamePiece, isAi) {
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
        if (checkWinner(player)) {
            displayController.playerWon(player);
            console.log('won');
            return;
        } else {
            console.log('switching turns');
            displayController.switchTurn();
        }
        changeStatus();
        checkBoard();
    }
    let checkBoard = () => {
        if (!board.includes(-1)) displayController.tie();
    }
    let checkWinner = (player) => {
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

    let vsAI = false;
    let player1 = null;
    let player2 = null;
    let playerTurn = null;
    let getPlayer1 = () => { return player1; }
    let getPlayer2 = () => { return player2; }
    let setPlayers = (p1, p2) => { 
        player1 = p1;
        player2 = p2;
    }
    let getTurn = () => { return playerTurn; }
    let setTurn = (player) => { playerTurn = player; }
    let switchTurn = () => {        
        playerTurn = (playerTurn === player1) ? player2 : player1;
        document.querySelector('#status-label').textContent = displayController.getTurn().getName() + '\'s turn';
    }
    let playerWon = (player) => {
        console.log(player.getName() + ' WOOOOON');
        // update UI
        // freeze UI besides reset button
        document.querySelector('#status-label').textContent = player.getName() + ' WON!!!';
        freezeTiles();
    }
    let tie = () => {
        console.log('tie!');
        document.querySelector('#status-label').textContent = 'TIE';
        freezeTiles();
    }
    
    return {
        vsAI,
        setPlayers,
        getPlayer1,
        getPlayer2,
        setTurn,
        getTurn,
        switchTurn,
        playerWon,
        tie
    }
})();

function vsPlayer() {
    resetTiles();
    displayController.vsAI = false;
    document.querySelector('.player-option').hidden = false;
    document.querySelector('#player2-input').hidden = false;
}

function vsAI() {
    resetTiles();
    displayController.vsAI = true;
    document.querySelector('.player-option').hidden = false;
    document.querySelector('#player2-input').hidden = true;
}

function checkSetInput() {
    const player1Input = document.querySelector('#player1-input').value;
    const player2Input = document.querySelector('#player2-input').value;
    if (displayController.vsAI) {
        if (player1Input === '') {
            alert('Please enter in a name for player 1');
            console.log(player1Input + ' ' + player2Input);
            return false;
        } else {
            displayController.setPlayers(
                createPlayer(player1Input, 'X', false),
                createPlayer('AI', 'O', true));
        }
    } else {
        if (player1Input === '' || player2Input === '') {
            alert('Please enter a name for both players');
            console.log(player1Input + ' ' + player2Input);
            return false;
        } else {
            displayController.setPlayers(createPlayer(player1Input, 'X', false),
                createPlayer(player2Input, 'O', false));
        }
    }
    displayController.setTurn(displayController.getPlayer1());
    return true;
}

function startGame() {
    if (checkSetInput()) {
        document.querySelector('.start-button').hidden = true;
        document.querySelector('.tile-table').hidden = false;
        document.querySelector('.div-option').hidden = true;
        document.querySelector('#status-label').hidden = false;
    }
}

function resetTiles() {
    gameBoard.resetBoard();
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach( (tile) => {
        tile.textContent = '';
        tile.addEventListener('click', markTile);
    });
    document.querySelector('.start-button').hidden = false;
    document.querySelector('.tile-table').hidden = true;
    document.querySelector('.div-option').hidden = false;
    document.querySelector('#status-label').hidden = true;
    document.querySelector('#status-label').textContent = '';
}

function freezeTiles() {
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach( (tile) => {
        tile.removeEventListener('click', markTile);
    });
}

function markTile() {
    if (!this.textContent) {
        console.log('marking tile: ' + displayController.getTurn());
        this.textContent = displayController.getTurn().getPiece();
        gameBoard.setTile(this.id, displayController.getTurn()); 
    }
}

function changeStatus() {
    document.querySelector('#status-label').value = displayController.getTurn() + '\'s turn';
}

function initializeTiles() {
    document.querySelector('.tile-table').hidden = true
    let tiles = Array.from(document.querySelectorAll('.tile'));
    let tileNum = 0;
    tiles.forEach( (tile) => {
        tile.id = tileNum;
        tileNum += 1;
        tile.addEventListener('click', markTile);
    });    
}

function initializeGame() {
    document.querySelector('.player-option').hidden = true;
    document.querySelector('#player2-input').hidden = true;
    document.querySelector('#status-label').hidden = true;
    initializeTiles();
}

document.querySelector('.reset-button').addEventListener('click', resetTiles);
document.querySelector('.start-button').addEventListener('click', startGame);
document.querySelector('#pVp').addEventListener('click', vsPlayer);
document.querySelector('#pVa').addEventListener('click', vsAI);

initializeGame();