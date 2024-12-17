import { playSound, myCreateElement, generateBoard } from "../utils.js";

export class AIBoard {
    constructor(mainPage, config, leaderboardObj) {
        this.mainPage = mainPage;
        this.leaderboardObj = leaderboardObj;

        this.state = new Array(config.size);
        const size = config.size;
        this.size = size
        
        this.stage = "drop";
        this.colorTurn = config.firstColorToPlay;
        this.playerColor = config.playerColor;
        this.turnsWitoutMoinho = 0;
        this.toRemove = false;

        this.validationVectors = [[1,7],  [-1,1], [-1,1], [-1,1], [1,-1], [1,-1], [1,-1], [-7,-1]];
        this.moinhoVectors = [[[7,6],[1,2]], [[-1,1]], [[-1,-2], [1,2]], [[-1,1]], [[-1,-2], [1,2]], [[1,-1]], [[-1,-2], [1,-6]], [[-7,-1]]];

        this.redPiecesContainer = myCreateElement("div", [["class", "redPiecesContainer"]], mainPage.board)
        this.middle = myCreateElement("div", [["class", "middle"]], mainPage.board)
        this.bluePiecesContainer = myCreateElement("div", [["class", "bluePiecesContainer"]], mainPage.board)

        for (let i = 0; i < size; i++) {
            this.state[i] = new Array(8).fill('empty'); // Initialize each square state
            for (let j = 0; j < 3; j++) {
                myCreateElement("div", [["class", "redPiece"]], this.redPiecesContainer);
                myCreateElement("div", [["class", "bluePiece"]], this.bluePiecesContainer);                
            }
        }

        const game = myCreateElement("div", [["class", "game"]], this.middle);

        // Generate column sizes alternating between 20px and 40px
        const num = 4 * size + 1; // Calculate number of columns (4 * size + 1)
        let sizes = [];
        for (let i = 0; i < num; i++) {
            // Alternate between 20px and 40px
            if (i % 2 === 0) sizes.push('20px');
            else sizes.push('40px');
        }

        // Set the grid template columns and generate board
        game.style.gridTemplateColumns = sizes.join(' ');
        game.style.gridTemplateRows = sizes.join(' ');
        generateBoard(size, game);

        this.selectedCell = {}
        this.selectedCell.cell = undefined;
        this.selectedCell.indexs = undefined;

        game.addEventListener("click", (event) => {
            if (event.target.classList.contains("cell")) {
                if (this.colorTurn == this.playerColor) {
                    const cell = event.target;
                    const [square, position] = cell.id.split("-").map(Number);
    
                    if (this.stage === "drop") {
                        if (this.state[square][position] == 'empty') {
                            this.placePiece(square, position, this.playerColor);
                            setTimeout(() => {
                                this.AIPlay();
                            }, 1500);
                        } 
                        else this.showMessage("Can't place here!", "failure");
                    } else {
                        if (this.toRemove) {
                            if (this.removePiece(square, position, this.playerColor)) {
                                setTimeout(() => {
                                    let validMoves = this.getAllValidMoves(this.colorTurn);
                                    if (validMoves.length == 0) this.draw();
                                    else this.AIPlay();
                                }, 1500);
                            };
                        } else if (this.state[square][position] == this.playerColor) {
                            if (this.selectedCell.cell !== undefined) this.selectedCell.cell.classList.remove('selected');
                            if (this.selectedCell.cell != cell) {
                                cell.classList.add('selected');
                                this.selectedCell.indexs = [square, position];
                                this.selectedCell.cell = cell;                                
                            } else {
                                this.selectedCell.indexs = undefined;
                                this.selectedCell.cell = undefined;
                            }
                        } else if (this.selectedCell.cell === undefined) {
                            if (this.state[square][position] == 'empty') this.showMessage("You don't have any selected piece!", "failure");
                            else if (this.state[square][position] != this.playerColor) this.showMessage("You can't select that piece!", "failure");
                        } else if (this.selectedCell.cell !== undefined) {
                            if (this.state[square][position] == 'empty') {
                                if (this.movePiece(square, position, this.playerColor)) {
                                    if (this.checkMoinho(this.playerColor, square, position)) {
                                        this.showMessage('Moinho!', "success");
                                        this.turnsWitoutMoinho = 0;
                                        this.toRemove = true;
                                    } else {
                                        this.turnsWitoutMoinho++;
                                        this.toogleTurn();
                                        setTimeout(() => {
                                            let validMoves = this.getAllValidMoves(this.colorTurn);
                                            if (validMoves.length == 0) this.draw();
                                            else this.AIPlay();
                                        }, 1500);
                                    }
                                }
                            }
                            else this.showMessage("You can't move the piece there!", "failure");
                        }
                    }
                } else this.showMessage("It's not you turn!", "failure");
            }
        });

        // Forsake
        const forsake = myCreateElement("div", [["class", "forsake"]], this.middle);
        forsake.innerHTML = 'Forsake';
        forsake.addEventListener("click", () => {
            this.forsake();
        })

        
        if (this.colorTurn == this.playerColor) this.showMessage(`It's ${this.playerColor} Turn!!`, "success");
        
        if (this.playerColor != this.colorTurn) this.AIPlay();
    }

    win = (color) => {
        this.showMessage(`${color} Wins!`, 'win');
        var points;
        if (color == 'Red') points = 100 * this.redPiecesNumber;
        else points = 100 * this.bluePiecesNumber;
        
        if (color == this.playerColor)
            this.leaderboardObj.addLeader(this.mainPage.username, this.size, points);

        setTimeout(() => {
            // Clean up the board by resetting the pieces
            this.redPiecesContainer.remove();
            this.middle.remove();
            this.bluePiecesContainer.remove();
            this.state = []; // Clear the state array
            this.mainPage.actualGame = null;
            this.mainPage.startGame.style.display = 'inline';
        }, 2000);
    }

    removePiece = (square, position, color) => {
        const oponentColor = color == "Red" ? "Blue" : "Red"
        if (this.state[square][position] == oponentColor) {
            const cell = document.getElementById(`${square}-${position}`);
            this.state[square][position] = 'empty';
            cell.classList.remove(oponentColor === 'Red' ? "red" : "blue");
            cell.classList.add("empty");
            this.toRemove = false;

            
            if (color == "Blue") {
                this.redPiecesNumber = this.redPiecesNumber-1
                if (this.redPiecesNumber < 3) {
                    this.win(color);
                    return false;
                }
            } else {
                this.bluePiecesNumber = this.bluePiecesNumber-1
                if (this.bluePiecesNumber < 3) {
                    this.win(color);
                    return false;
                }
            };

            this.toogleTurn();
            return true;
        } else {
            this.showMessage("Can't remove this!", "failure");
        }
    }

    checkMoinho = (color, square, position) => {
        
        for (var vectorArray of this.moinhoVectors[position])
            if (this.state[square][position+vectorArray[0]] == color && this.state[square][position+vectorArray[1]] == color) return true;
        
        if ((position == 1 || position == 7 || position == 3 || position == 5) && this.size >= 3) {
            if (square-2 >= 0 && (this.state[square-1][position] == color && this.state[square-2][position] == color)) return true
            if (square+1 < this.size && square-1 >= 0 && (this.state[square+1][position] == color && this.state[square-1][position] == color)) return true
            if (square+2 < this.size && (this.state[square+1][position] == color && this.state[square+2][position] == color)) return true
        }
        
        return false
    }

    toogleTurn = () => {
        this.colorTurn = this.colorTurn === 'Red' ? 'Blue' : 'Red';
        this.showMessage(`${this.colorTurn}'s Turn!`, "success");
    }

    placePiece = (square, position, color) => {
        const cell = document.getElementById(`${square}-${position}`);
        this.state[square][position] = color;
        cell.classList.remove("empty");
        cell.classList.add(color === 'Red' ? "red" : "blue");
        playSound("success");

        if (color === 'Red') this.redPiecesContainer.removeChild(this.redPiecesContainer.children[0]);
        else this.bluePiecesContainer.removeChild(this.bluePiecesContainer.children[0]);  

        this.toogleTurn();

        if ((this.redPiecesContainer.children.length <= 0) && (this.bluePiecesContainer.children.length <= 0)) {
            this.stage = "move"
            this.bluePiecesNumber = 3 * this.size;
            this.redPiecesNumber = 3 * this.size;

            let validMoves = this.getAllValidMoves(this.colorTurn);
            if (validMoves.length == 0) this.draw();
        };
    }

    movePiece = (square, position, color) => {
        if (this.IsValidMove(square, position)) {
            const cell = document.getElementById(`${square}-${position}`);
            this.state[this.selectedCell.indexs[0]][this.selectedCell.indexs[1]] = 'empty';
            this.selectedCell.cell.classList.remove(color === 'Red' ? "red" : "blue");
            this.selectedCell.cell.classList.add("empty");
            this.selectedCell.cell.classList.remove("selected");

            this.state[square][position] = color;
            cell.classList.remove("empty");
            cell.classList.add(color === 'Red' ? "red" : "blue");
            
            playSound("success");

            this.selectedCell.cell = undefined;
            this.selectedCell.indexs = undefined;

            return true
        } else {
            this.showMessage("Invalid Move", "failure");
            return false
        }
    }

    draw = () => {
        this.showMessage("Its a Draw!!", "failure");
    
        // After 2 seconds, reset the board to a fresh state, or transition back to a main menu
        setTimeout(() => {
            // Clean up the board by resetting the pieces
            this.redPiecesContainer.remove();
            this.middle.remove();
            this.bluePiecesContainer.remove();
            this.state = []; // Clear the state array
            this.mainPage.actualGame = null;
            this.mainPage.startGame.style.display = 'inline';
        }, 2000);
    }

    AIPlay = () => {
        if (this.stage == "drop") {
            const possiblePositions = [];
            for (let square = 0; square < this.size; square++) {
                for (let position = 0; position < 8; position++) {
                    if (this.state[square][position] == 'empty') possiblePositions.push([square, position]);
                }
            }
            
            const randomPosition = possiblePositions[Math.floor(Math.random() * possiblePositions.length)]
            this.placePiece(randomPosition[0], randomPosition[1], this.playerColor == "Red" ? "Blue" : "Red")
        } else {
            let validMoves = this.getAllValidMoves(this.colorTurn);
            if (validMoves.length != 0) {            
                let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

                const [square, position, nextMoves] = randomMove;

                const cell = document.getElementById(`${square}-${position}`);
                this.selectedCell = { indexs: [square, position], cell };

                if (nextMoves && nextMoves.length > 0) {
                    let nextMove = nextMoves[Math.floor(Math.random() * nextMoves.length)];
                    if (this.movePiece(nextMove[0], nextMove[1], this.colorTurn)) {
                        if (this.checkMoinho(this.playerColor == "Red" ? "Blue" : "Red", nextMove[0], nextMove[1])) {
                            this.turnsWitoutMoinho = 0;

                            const possiblePositions = [];
                            for (let square = 0; square < this.size; square++) {
                                for (let position = 0; position < 8; position++) {
                                    if (this.state[square][position] == this.playerColor) possiblePositions.push([square, position]);
                                }
                            }

                            const randomPosition = possiblePositions[Math.floor(Math.random() * possiblePositions.length)]
                	        this.removePiece(randomPosition[0], randomPosition[1], this.playerColor == "Red" ? "Blue" : "Red")
                        } else {
                            this.turnsWitoutMoinho++;
                            this.toogleTurn();
                        }
                    };
                }

                let nextValidMoves = this.getAllValidMoves(this.colorTurn);
                if (nextValidMoves.length === 0) this.draw();
      
            }

        }
    }

    getAllValidMoves = (color) => {

        const validMoves = []

        for (let square = 0; square < this.size; square++) {
            for (let position = 0; position < 8; position++) {
                if (this.state[square][position] == color) {
                    const positionValidMoves = this.getValidMoves(square, position)
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

    getValidMoves = (square, position) => {
        const moves = [];

        for (let vect of this.validationVectors[position])
            if (this.state[square][position+vect] == 'empty') moves.push([square, position+vect]);

        if (position == 1 || position == 3 || position == 7 || position == 5) {
            if (square+1 < this.size && this.state[square+1][position] == 'empty') moves.push([square+1, position]);
            if (square-1 >= 0 && this.state[square-1][position] == 'empty') moves.push([square-1, position]);
        }
        
        return moves;
    }

    IsValidMove = (square, position) => {
        if (square < 0 || square > this.size-1) return false;
        if (this.state[square][position] != 'empty') return false;

        for (let vect of this.validationVectors[this.selectedCell.indexs[1]]) {
            if (this.selectedCell.indexs[1]+vect == position && this.selectedCell.indexs[0] == square) return true;
        }
        const selectedCellPos = this.selectedCell.indexs[1];
        if (selectedCellPos == 1 || selectedCellPos == 3 || selectedCellPos == 5 || selectedCellPos == 7) {
            if ((this.selectedCell.indexs[0]-1 == square || this.selectedCell.indexs[0]+1 == square) && this.selectedCell.indexs[1] == position) return true
        }
        return false
    }

    showMessage = (messageText, type) => {
        const message = document.createElement("div");
        message.setAttribute("class", "messageBox");
        message.innerText = messageText;

        playSound(type);

        this.mainPage.board.appendChild(message);
        setTimeout(() => {
            // After 1 second, remove the message with a fade-out animation
            message.style.animation = 'fadeOut 1s forwards';
            
            // After the animation completes (1 second), remove the message from the DOM
            setTimeout(() => {
                message.remove();
            }, 1000); // Same duration as the animation
        }, 1000); // Delay for message to be visible before fading out
    }

    forsake = () => {
        this.showMessage("Player has forsaken!!", "failure");
    
        // After 2 seconds, reset the board to a fresh state, or transition back to a main menu
        setTimeout(() => {
            // Clean up the board by resetting the pieces
            this.redPiecesContainer.remove();
            this.middle.remove();
            this.bluePiecesContainer.remove();
            this.state = []; // Clear the state array
            this.mainPage.actualGame = null;
            this.mainPage.startGame.style.display = 'inline';
        }, 2000);
    }

}