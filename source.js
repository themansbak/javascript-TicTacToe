/**
 * setup player name
 * piece assignment should be done in button eventlistener
 */
const createPlayer = function(playerName, gamePiece, isAi) {
    // assign X || O
    // based off that  determine board piece?
    let getPiece = () => { return gamePiece; }
    let getName = () => { return playerName; }
    let getAI = () => { return isAi; }
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
            // AI reviews winning combos, chooses the combo with 2 of 3 indices and picks the last index
            // Always check losing combos, where the PLAYER has a winning chance
            // If none of the winning combos, check own winning chance
            // if AI, call mark Tile for AI
            if(displayController.getTurn().getAI()) {
                let AI = displayController.getTurn();
                let pos = Math.floor(Math.random() * 9) + 1; 
                while(board[pos] !== -1) {
                    pos = Math.floor(Math.random() * 9) + 1;
                }

                winningCombos.forEach((combo) => {
                    

                })
                board[pos] = AI.getPiece();
                let tiles = Array.from(document.querySelectorAll('.tile'));
                tiles[pos].textContent = AI.getPiece();
                if(checkWinner(AI)) {
                    displayController.playerWon(AI);
                    return;
                } 
                else {
                    displayController.switchTurn();
                }
            }
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

    let vsAI = false;
    let player1 = null;
    let player2 = null;
    let playerTurn = null;
    const statusLabel = document.querySelector('#status-label');
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
        document.querySelector('#status-label').textContent = "Current player's turn: " + playerTurn.getName();
    }
    let playerWon = (player) => {
        console.log(player.getName() + ' WOOOOON');
        // update UI
        statusLabel.textContent = player.getName() + ' won!';
        statusLabel.style.backgroundColor = 'green';
        statusLabel.style.size = '200%';
        // freeze UI besides reset button
        freezeTiles();
    }
    let tie = () => {
        console.log('tie!');
        // update UI
        statusLabel.textContent = 'Both ' + player1.getName() + ' and ' + player2.getName() + ' tied!';
        statusLabel.style.backgroundColor = 'yellow';
        statusLabel.style.size = '200%';
        // freeze UI besides reset button
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
        document.querySelector('.tile-table').hidden = false;
        document.querySelector('.div-option').hidden = true;
        document.querySelector('#status-label').hidden = false;
        document.querySelector('#status-label').textContent = "Current player's turn: " + displayController.getTurn().getName();
    }
}

function resetTiles() {
    gameBoard.resetBoard();
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach( (tile) => {
        tile.textContent = '';
        tile.addEventListener('click', markTile);
    });
    document.querySelector('.tile-table').hidden = true;
    document.querySelector('.div-option').hidden = false;
    document.querySelector('#status-label').textContent = '';
    document.querySelector('#status-label').style.backgroundColor = '';
    document.querySelector('#status-label').hidden = true;
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

function initializeTiles() {
    document.querySelector('.tile-table').hidden = true;
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