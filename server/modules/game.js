const crypto = require('crypto');
const users = require('./users.js');
const rankings = require('./rankings.js');

let queue = {} // each group would have an active queue per time
let lobbys = {}

const genGameHash = (group, size) => {
    const uniqueValue = `${group}-${size}-${Date.now()}`;

    const gameHash = crypto
               .createHash('md5')
               .update(uniqueValue)
               .digest('hex');

    return gameHash;
}

const createNewQueue = (group, size, nick) => {
    
    let gameHash = genGameHash(group, size);
    queue[group+size] = gameHash;

    lobbys[gameHash] = {}
    lobbys[gameHash].responses = [];
    lobbys[gameHash].turn = nick;
    lobbys[gameHash].players = {[nick]: "blue"};
    lobbys[gameHash].size = size;
    lobbys[gameHash].queue = group+size;
    lobbys[gameHash].group = group;

    return gameHash
}

const remember = (gameId, response) =>
    lobbys[gameId].responses.push(response);

const remove = (gameId, res) => {
    let pos = lobbys[gameId].responses.findIndex((resp) => resp === res);
    if(pos > -1)
        lobbys[gameId].responses.splice(pos,1);

    if (lobbys[gameId].responses.lenght == 0) 
        lobbys[gameId] = null;
}
        

const update = function(gameId, message) {
    for(let response of lobbys[gameId].responses) {
        const messageData = JSON.stringify(message);
        response.write('data: '+ messageData +'\n\n');
    }
}

const initializeGame = (game) => {
    lobbys[game].board = [];
    for (let s = 0; s < lobbys[game].size; s++) {
        lobbys[game].board[s] = [];
        for (let i = 0; i < 8; i++) {
            lobbys[game].board[s][i] = 'empty';
        }
    }
    lobbys[game].phase = "drop";
    lobbys[game].step = "from";
    lobbys[game].pieces = {};
    lobbys[game].pieces['red'] = 3 * lobbys[game].size;
    lobbys[game].pieces['blue'] = 3 * lobbys[game].size;
}

const validationVectors = [[1,7],  [-1,1], [-1,1], [-1,1], [1,-1], [1,-1], [1,-1], [-7,-1]];

const getValidMoves = (game, square, position) => {
    const moves = [];

    for (let vect of validationVectors[position])
        if (lobbys[game].board[square][position+vect] == 'empty') moves.push([square, position+vect]);

    if (position == 1 || position == 3 || position == 7 || position == 5) {
        if (square+1 < lobbys[game].size && lobbys[game].board[square+1][position] == 'empty') moves.push([square+1, position]);
        if (square-1 >= 0 && lobbys[game].board[square-1][position] == 'empty') moves.push([square-1, position]);
    }
    
    return moves;
}

const getAllValidMoves = (game, color) => {

    const validMoves = []

    for (let square = 0; square < lobbys[game].size; square++) {
        for (let position = 0; position < 8; position++) {
            if (lobbys[game].board[square][position] == color) {
                const positionValidMoves = getValidMoves(game, square, position)
                if (positionValidMoves.length > 0) {
                    const move = [square, position];
                    move.push(positionValidMoves);
                    validMoves.push(move);
                }
            }
        }
    }

    return validMoves;

}

const moinhoVectors = [[[7,6],[1,2]], [[-1,1]], [[-1,-2], [1,2]], [[-1,1]], [[-1,-2], [1,2]], [[1,-1]], [[-1,-2], [1,-6]], [[-7,-1]]];

const checkMoinho = (game, color, square, position) => {

    const state = lobbys[game].board;
        
    for (var vectorArray of moinhoVectors[position])
        if (state[square][position+vectorArray[0]] == color && state[square][position+vectorArray[1]] == color) return true;
    
    if ((position == 1 || position == 7 || position == 3 || position == 5) && lobbys[game].size >= 3) {
        if (square-2 >= 0 && (state[square-1][position] == color && state[square-2][position] == color)) return true
        if (square+1 < lobbys[game].size && square-1 >= 0 && (state[square+1][position] == color && state[square-1][position] == color)) return true
        if (square+2 < lobbys[game].size && (state[square+1][position] == color && state[square+2][position] == color)) return true
    }
    
    return false
}

const play = (game, square, position, color) => {

    const changeTurn = () => {
        for (let player in lobbys[game].players) {
            if (player != lobbys[game].turn) {
                lobbys[game].turn = player;
                break;
            }
        }
    }

    if (lobbys[game].phase == "drop") {
        lobbys[game].board[square][position] = color;
        lobbys[game].pieces[color] -= 1;
        if (lobbys[game].pieces['red'] == 0 && lobbys[game].pieces['blue'] == 0) {
            lobbys[game].phase = "move";
            lobbys[game].pieces['red'] = 3 * lobbys[game].size;
            lobbys[game].pieces['blue'] = 3 * lobbys[game].size;
        }
        changeTurn();
    } else if (lobbys[game].step == "from") {
        lobbys[game].step = "to";
        lobbys[game].selectedCell = [square, position];
    } else if (lobbys[game].step == "to") {
        const selectedSquare = lobbys[game].selectedCell[0];
        const selectedPosition = lobbys[game].selectedCell[1];
        if (! (selectedPosition == position && selectedSquare == square)) {
            lobbys[game].board[selectedSquare][selectedPosition] = 'empty';
            lobbys[game].board[square][position] = color;
            if (checkMoinho(game, lobbys[game].players[lobbys[game].turn], square, position))
                lobbys[game].step = "take";
            else {
                changeTurn();
                lobbys[game].step = "from";
            }
        } else
            lobbys[game].step = "from";
        lobbys[game].selectedCell = undefined;
    } else if (lobbys[game].step == "take") {
        lobbys[game].pieces[lobbys[game].players[lobbys[game].turn]] -= 1;
        lobbys[game].board[square][position] = 'empty';
        lobbys[game].step = "from";
        if (lobbys[game].pieces[lobbys[game].players[lobbys[game].turn]] < 3) {
            for (let player in lobbys[game].players) {
                if (player != lobbys[game].turn) {
                    rankings.addGame(lobbys[game].group, lobbys[game].size, lobbys[game].turn, player)
                    break;
                }
            }
            update(game, {board: lobbys[game].board, phase: lobbys[game].phase, step: lobbys[game].step, turn: lobbys[game].turn, winner: lobbys[game].turn});
            return;
        }
        changeTurn();
    }

    if (lobbys[game].phase != "drop" &&  lobbys[game].step == "from" && getAllValidMoves(game, lobbys[game].players[lobbys[game].turn]).length == 0)
        update(game, {board: lobbys[game].board, phase: lobbys[game].phase, step: lobbys[game].step, turn: lobbys[game].turn, winner: null});
    else 
        update(game, {board: lobbys[game].board, phase: lobbys[game].phase, step: lobbys[game].step, turn: lobbys[game].turn});


}

module.exports.addUpdater = (gameId, req, res) => {

    if (lobbys[gameId] !== undefined) {
        remember(gameId, res);
        req.on('close', () =>
            remove(gameId, res)
        );
        if (lobbys[gameId].board !== undefined)
            update(gameId, {board: lobbys[gameId].board, phase: lobbys[gameId].phase, step: lobbys[gameId].step, turn: lobbys[gameId].turn, players: lobbys[gameId].players});
    }  else {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: "Invalid game reference" })}\n\n`);
    }
}

module.exports.join = async (group, size, nick, password, sendResponse) => {
    try {
        const isValid = await users.verifyCredentials(nick, password);

        if (!isValid) {
            sendResponse(401, {error: 'Invalid credentials'})
        }

        let gameHash = queue[group+size];

        if (gameHash) {
            sendResponse(200, {game: gameHash});
            lobbys[gameHash].players[nick] = "red";
            queue[group+size] = null;
            initializeGame(gameHash);
        } else {
            try {
                const gameHash = createNewQueue(group, size, nick);
                sendResponse(200, {game: gameHash})
            } catch (error) {
                console.error("Error verifying credentials:", error);
                sendResponse(500, {error: 'Internal server error'});
            }
        }
    } catch (error) {
        console.error("Error verifying credentials:", error);
        sendResponse(500, {error: 'Internal server error'});
    }
};

module.exports.leave = async (nick, password, game, sendResponse) => {
    try {
        const isValid = await users.verifyCredentials(nick, password);

        if (!isValid) {
            sendResponse(403, {error: 'Invalid credentials'})
        }

        if (lobbys[game] === undefined)
            sendResponse(401, {error: 'Invalid game reference'});
        else if (queue[lobbys[game].queue]) {
            sendResponse(200, {});
            update(game, {winner: null});
            queue[lobbys[game].queue] = null;
        } else {
            for (let player in lobbys[game].players) {
                if (player != nick) {
                    sendResponse(200, {});
                    rankings.addGame(lobbys[game].group, lobbys[game].size, player, nick)
                    update(game, {winner: player});
                    break;
                }
            }
        }
        

        
    } catch (error) {
        console.error("Error verifying credentials:", error);
        sendResponse(500, {error: 'Internal server error'});
    }
}

module.exports.notify = async (nick, password, game, cell, sendResponse) => {

    const IsValidMove = (selectedSquare, selectedPosition, square, position) => {
        if (square < 0 || square > lobbys[game].size-1) return false;

        for (let vect of validationVectors[selectedPosition])
            if (selectedPosition+vect == position && selectedSquare == square) return true;
        
        const selectedCellPos = selectedPosition;
        if (selectedCellPos == 1 || selectedCellPos == 5 || selectedCellPos == 3 || selectedCellPos == 7)
            if ((selectedSquare-1 == square || selectedSquare+1 == square) && selectedCellPos == position) return true

        return false
    }

    try {
        const isValid = await users.verifyCredentials(nick, password);

        if (!isValid) {
            sendResponse(403, {error: 'Invalid credentials'})
            return;
        }
       

        if (!nick ) {
            sendResponse(400, {error: 'Missing argument nick'})
            return;
        } else if (!password) {
            sendResponse(400, {error: 'Missing argument password'})
            return;
        } else if (!game) {
            sendResponse(400, {error: 'Missing argument game'})
            return;
        } else if (!cell) {
            sendResponse(400, {error: 'Missing argument move'})
            return;
        }
        
        if (typeof nick !== "string") {
            sendResponse(400, {error: 'Invalid argument nick'})
            return;
        } else if (typeof password !== "string") {
            sendResponse(400, {error: 'Invalid argument password'})
            return;
        } else if (lobbys[game].board === undefined) {
            sendResponse(400, {error: 'Invalid argument game'})
            return;
        } else if (cell.square === undefined || cell.square < 0 || cell.square >= lobbys[game].size || cell.position === undefined || cell.position >= 8 ||  cell.position < 0) {
            sendResponse(400, {error: 'Invalid argument cell'})
            return;
        }

        if (lobbys[game] === undefined) {
            sendResponse(400, {error: 'Invalid game reference'})
            return;
        }
        
        if (nick != lobbys[game].turn) {
            sendResponse(400, {error: 'Not your turn to play'})
            return;
        }

        if (lobbys[game].phase == "drop" && lobbys[game].board[cell.square][cell.position] != 'empty') {
            sendResponse(400, { "error": "non empty cell" })
            return;
        } else if (lobbys[game].phase == "move" && lobbys[game].step == "from" && lobbys[game].board[cell.square][cell.position] != lobbys[game].players[nick]) {
            sendResponse(400, { "error": "Invalid move: not your piece" })
            return;
        } else if (lobbys[game].phase == "move" && lobbys[game].step == "to") {
            if (lobbys[game].selectedCell[1] != cell.position || lobbys[game].selectedCell[0] != cell.square) {
                if (lobbys[game].board[cell.square][cell.position] != 'empty') {
                    sendResponse(400, { "error": "Invalid move: non empty cell" }) 
                    return;
                } else if (!IsValidMove(lobbys[game].selectedCell[0], lobbys[game].selectedCell[1], cell.square, cell.position)) {
                    sendResponse(400, { "error": "Invalid move: can only move to neigbouring cells, vertical or horizontally" });
                    return; 
                }
            }
        } else if (lobbys[game].phase == "move" && lobbys[game].step == "take") {
            if (lobbys[game].board[cell.square][cell.position] == lobbys[game].players[nick] || lobbys[game].board[cell.square][cell.position] == 'empty') {
                sendResponse(400, { "error": "No opponent piece to take" });
                return; 
            }
        }
        

        play(game, cell.square, cell.position, lobbys[game].players[nick]);
        
        sendResponse(200, {});
        return;
        

        
    } catch (error) {
        console.error("Error verifying credentials:", error);
        sendResponse(500, {error: 'Internal server error'});
    }
}


