export class Board {
    constructor(mainPage, size, toPlay, IALevel, leaderboardObj) {
        this.state = new Array(size);
        this.mainPage = mainPage;
        this.stage = "placement";
        this.toPlay = toPlay;
        this.size = size;
        this.leaderboardObj = leaderboardObj;

        this.successSound = new Audio('audios/success.mp3');
        this.winSound = new Audio('audios/win.mp3');
        this.failureSound = new Audio('audios/failure.mp3');

        this.redPiecesContainer = document.createElement("div");
        this.redPiecesContainer.setAttribute("class", "redPiecesContainer");
        this.middle = document.createElement("div");
        this.middle.setAttribute("class", "middle");
        this.bluePiecesContainer = document.createElement("div");
        this.bluePiecesContainer.setAttribute("class", "bluePiecesContainer");

        for (let i = 0; i < size; i++) {
            this.state[i] = new Array(8).fill('empty');
            for (let j = 0; j < 3; j++) {
                const redPiece = document.createElement("div");
                redPiece.setAttribute("class", "redPiece");
                this.redPiecesContainer.appendChild(redPiece);
                
                const bluePiece = document.createElement("div");
                bluePiece.setAttribute("class", "bluePiece");
                this.bluePiecesContainer.appendChild(bluePiece);
            }
        }

        const game = document.createElement("div");
        game.setAttribute("class", "game");


        // Calculate number of columns (4 * size + 1)
        const num = 4 * size + 1;

        // Generate column sizes alternating between 20px and 40px
        let sizes = [];
        for (let i = 0; i < num; i++) {
            // Alternate between 20px and 40px
            if (i % 2 === 0) {
                sizes.push('20px');
            } else {
                sizes.push('40px');
            }
        }

        // Set the grid template columns
        game.style.gridTemplateColumns = sizes.join(' ');
        game.style.gridTemplateRows = sizes.join(' ');
        this.middle.appendChild(game);

        // Create the upper part of the grid (size-1 to 0)
        for (let i = size - 1; i >= 0; i--) {

            for (let numEmptySpace = (size - 1)-i; numEmptySpace > 0; numEmptySpace--) {
                
                const vrule = document.createElement("div");
                vrule.classList.add("vrule");
                game.appendChild(vrule);

                const emptySpace = document.createElement("div");
                emptySpace.classList.add("emptySpace");
                game.appendChild(emptySpace);
                
            }

            for (let j = 0; j < 3; j++) {

                const cell = document.createElement("div");
                cell.classList.add("cell", 'empty');
                cell.setAttribute("id", `${i}-${j}`);
                game.appendChild(cell);
                
                
                
                if (j < 2) {
                    const hrule = document.createElement("div");
                    hrule.classList.add("hrule");
                    game.appendChild(hrule);
                    
                    // Repeat hrule based on current row i (you can adjust the multiplier if needed)
                    for (let numHrule = 2 * i; numHrule > 0; numHrule--) {
                        const hrule = document.createElement("div");
                        hrule.classList.add("hrule");
                        game.appendChild(hrule);
                    }
                }
            }

            for (let numEmptySpace = (size - 1)-i; numEmptySpace > 0; numEmptySpace--) {
                const emptySpace = document.createElement("div");
                emptySpace.classList.add("emptySpace");
                game.appendChild(emptySpace);

                const vrule = document.createElement("div");
                vrule.classList.add("vrule");
                game.appendChild(vrule);
            }

            let vrule = document.createElement("div");
            vrule.classList.add("vrule");
            game.appendChild(vrule);

            for (let numEmptySpace = (4 * size) - 1; numEmptySpace > 0; numEmptySpace--) {

                if (numEmptySpace == ((2 * size)) && i >= 1) {
                    const vrule = document.createElement("div");
                    vrule.classList.add("vrule");
                    game.appendChild(vrule);
                } else {
                    const emptySpace = document.createElement("div");
                    emptySpace.classList.add("emptySpace");
                    game.appendChild(emptySpace);
                }

            }

            vrule = document.createElement("div");
            vrule.classList.add("vrule");
            game.appendChild(vrule);

        }
        
        for (let k = size-1; k > 0; k--) {
            let cell = document.createElement("div");
            cell.classList.add("cell", 'empty');
            cell.setAttribute("id", `${k}-${3}`);
            game.appendChild(cell);
            
            const hrule = document.createElement("div");
            hrule.classList.add("hrule");
            game.appendChild(hrule);
        }
        
        let cell = document.createElement("div");
        cell.classList.add("cell", 'empty');
        cell.setAttribute("id", `${0}-${3}`);
        game.appendChild(cell);
        
        for (let k = 3; k > 0; k--) {
            const emptySpace = document.createElement("div");
            emptySpace.classList.add("emptySpace");
            game.appendChild(emptySpace);
        }
        
        cell = document.createElement("div");
        cell.classList.add("cell", 'empty');
        cell.setAttribute("id", `${0}-${4}`);
        game.appendChild(cell);
        
        for (let k = size-1; k > 0; k--) {
            const hrule = document.createElement("div");
            hrule.classList.add("hrule");
            game.appendChild(hrule);
            
            let cell = document.createElement("div");
            cell.classList.add("cell", 'empty');
            cell.setAttribute("id", `${k}-${4}`);
            game.appendChild(cell);
            
        }
    
        // Create the lower part of the grid (size to 0)
        for (let i = 0; i < size; i++) {

            let vrule = document.createElement("div");
            vrule.classList.add("vrule");
            game.appendChild(vrule);

            for (let numEmptySpace = 4 * size - 1; numEmptySpace > 0; numEmptySpace--) {

                if (numEmptySpace == ((2 * size)) && i >= 1) {
                    const vrule = document.createElement("div");
                    vrule.classList.add("vrule");
                    game.appendChild(vrule);
                } else {
                    const emptySpace = document.createElement("div");
                    emptySpace.classList.add("emptySpace");
                    game.appendChild(emptySpace);
                }

            }

            vrule = document.createElement("div");
            vrule.classList.add("vrule");
            game.appendChild(vrule);

            for (let numEmptySpace = (size - 1)-i; numEmptySpace > 0; numEmptySpace--) {
                
                const vrule = document.createElement("div");
                vrule.classList.add("vrule");
                game.appendChild(vrule);

                const emptySpace = document.createElement("div");
                emptySpace.classList.add("emptySpace");
                game.appendChild(emptySpace);
                
            }

            for (let j = 0; j < 3; j++) {

                const cell = document.createElement("div");
                cell.classList.add("cell", 'empty');
                cell.setAttribute("id", `${i}-${5+j}`);
                game.appendChild(cell);
    
                if (j < 2) {
                    const hrule = document.createElement("div");
                    hrule.classList.add("hrule");
                    game.appendChild(hrule);
    
                    // Repeat hrule based on current row i (you can adjust the multiplier if needed)
                    for (let numHrule = 2 * i; numHrule > 0; numHrule--) {
                        const hrule = document.createElement("div");
                        hrule.classList.add("hrule");
                        game.appendChild(hrule);
                    }
                }
            }

            for (let numEmptySpace = (size - 1)-i; numEmptySpace > 0; numEmptySpace--) {
                const emptySpace = document.createElement("div");
                emptySpace.classList.add("emptySpace");
                game.appendChild(emptySpace);

                const vrule = document.createElement("div");
                vrule.classList.add("vrule");
                game.appendChild(vrule);
            }
        }

        game.addEventListener("click", (event) => {
            if (event.target.classList.contains("cell") && this.toPlay === 0) {
                const cell = event.target;
                const [square, position] = cell.id.split("-").map(Number);
        
                // Attempt to play if it's the player's turn and in the correct stage
                if (this.stage === "placement") {
                    this.play(square, position, 'red');
                } else if (this.stage == "move") {

                    if (this.selectedCell === undefined && this.state[square][position] != 'empty') {
                        this.selectedCell = new Object();
                        this.selectedCell.cell = cell;
                        this.selectedCell.square = square;
                        this.selectedCell.position = position;
                        cell.classList.add('selected');
                    } else if (this.selectedCell !== undefined && this.selectedCell.square == square && this.selectedCell.position == position) {
                        this.selectedCell.cell.classList.remove('selected');
                        this.selectedCell = undefined;
                    } else {
                        this.move(square, position, 'red');
                    }

                } else {
                    if (this.state[square][position] == "blue") {
                        this.bluePiecesNumber -= 1;
                        cell.classList.remove('blue');
                        cell.classList.add('empty');
                        this.stage = "move";
                        if (this.bluePiecesNumber <= 2) {
                            this.win('red');
                        }
                    } else {
                        // Handle case when the square is empty or an invalid piece
                        this.showMessage("Invalid action: No piece to remove!", "failure");
                    }
                }
            }
        });

        const forsake = document.createElement("div");
        forsake.innerHTML = 'Forsake';
        forsake.setAttribute("class", "forsake");
        this.middle.appendChild(forsake);
        forsake.addEventListener("click", () => {
            forsake.remove();
            this.forsake();
        })

        mainPage.board.appendChild(this.redPiecesContainer);
        mainPage.board.appendChild(this.middle);
        mainPage.board.appendChild(this.bluePiecesContainer);

        
        if (this.toPlay == 0) {
            this.showMessage("It's Red Turn!!", "success");
            this.play();
        } else {
            this.showMessage("It's Blue Turn!!", "success");
            this.IAPlay();
        }

    }

    win = (color) => {
        if (color == 'red') {
            const points = 100 * this.redPiecesNumber;
            this.showMessage("Red Wins!", 'win');
            this.leaderboardObj.addLeader('Player', points);
        } else {
            const points = 100 * this.bluePiecesNumber;
            this.showMessage("Blue Wins!", 'win');
            this.leaderboardObj.addLeader('AI', points);
        }

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

    play = (square, position, color) => {

        if (this.stage === "placement" && this.state && this.state[square][position] === 'empty') {
            this.state[square][position] = color;
            const cell = document.getElementById(`${square}-${position}`);
            cell.classList.remove("empty");
            cell.classList.add(color === 'red' ? "red" : "blue");
            this.successSound.play();

            if (color === 'red') {
                this.redPiecesContainer.removeChild(this.redPiecesContainer.children[0]);
            } else if (color === 'blue') {
                this.bluePiecesContainer.removeChild(this.bluePiecesContainer.children[0]);  
            }

            this.toPlay = color === 'red' ? 1 : 0;
            if ((this.redPiecesContainer.children.length <= 0) && (this.bluePiecesContainer.children.length <= 0)) {
                this.stage = "move"
                this.bluePiecesNumber = 3 * this.size;
                this.redPiecesNumber = 3 * this.size;
                
                if (color === 'red') {
                    this.showMessage("Blue's Turn!", "success");
                    setTimeout(() => {
                        this.AImove()
                    }, 1500); // Delay AI's move for clarity
                    return
                } else {
                    if (this.checkValidMoves('red').length <= 0) {
                        this.showMessage("No possible moves!! Blue Plays!", "failure");
                        setTimeout(() => this.AImove(), 500);
                        return;
                    } else {
                        this.showMessage("Red's Turn!", "success");
                    }
                }
            }; 

            if (color === 'red') {
                this.showMessage("Blue's Turn!", "success");
                setTimeout(() => {
                    this.IAPlay()
                }, 1500); // Delay AI's move for clarity
            } else {
                this.showMessage("Red's Turn!", "success");
            }
        } else {
            this.showMessage("Invalid Move", "failure");
        }
    }

    randomPosition = () => {
        return [Math.floor(Math.random() * this.state.length), Math.floor(Math.random() * 8)];
    } 

    IAPlay = () => {
        let [square, position] = this.randomPosition();
        while (this.state[square][position] !== 'empty') {
            [square, position] = this.randomPosition();
        }
        this.play(square, position, "blue");
    }

    move = (square, position, color) => {
        // Check if the current cell contains the player's piece
        const selectedCellColor = this.state[this.selectedCell.square][this.selectedCell.position];
        if (selectedCellColor !== color) {
            this.showMessage("Invalid Move: Not Your Piece", "failure");
            return;  // If the cell doesn't have the player's piece, it's an invalid move
        }

        const directions = [
            { square: 1, position: 0 }, 
            { square: -1, position: 0 },
        ];

        if (this.selectedCell.position == 1 || this.selectedCell.position == 6) {
            directions.push({ square: 0, position: 1 });
            directions.push({ square: 0, position: -1 });
        } else if (this.selectedCell.position == 3) {
            directions.push({ square: 0, position: -3 });
            directions.push({ square: 0, position: 2 });
        } else if (this.selectedCell.position == 4) {
            directions.push({ square: 0, position: 3 });
            directions.push({ square: 0, position: -2 });
        } else if (this.selectedCell.position == 0) {
            directions.push({ square: 0, position: 1 });
            directions.push({ square: 0, position: 3 });
        } else if (this.selectedCell.position == 5) {
            directions.push({ square: 0, position: -2 });
            directions.push({ square: 0, position: 1 });
        } else if (this.selectedCell.position == 2) {
            directions.push({ square: 0, position: -1 });
            directions.push({ square: 0, position: 2 });
        } else if (this.selectedCell.position == 7) {
            directions.push({ square: 0, position: -3 });
            directions.push({ square: 0, position: -1 });
        }

        let validMove = false;

        // Check all 4 possible directions
        for (let dir of directions) {
            const newSquare = this.selectedCell.square + dir.square;
            const newPosition = this.selectedCell.position + dir.position;

            if (newSquare == square && newPosition == position)  {
                const targetCell = this.state[square][position];

                // If the target cell is empty, the move is valid
                if (targetCell === 'empty') {
                    validMove = true;
                    
                    // Update the state: move the piece
                    this.state[square][position] = color;  // Place the piece in the new cell
                    this.state[this.selectedCell.square][this.selectedCell.position] = 'empty';  // Remove the piece from the original cell

                    // Update the DOM: move the piece
                    const targetCellDom = document.getElementById(`${square}-${position}`);
                    targetCellDom.classList.remove("empty");
                    targetCellDom.classList.add(color === 'red' ? "red" : "blue");

                    const currentCellDom = document.getElementById(`${this.selectedCell.square}-${this.selectedCell.position}`);
                    currentCellDom.classList.remove(color === 'red' ? "red" : "blue");
                    currentCellDom.classList.add("empty");

                    this.successSound.play();  // Play success sound

                    break;
                }
            }
        }

        // If no valid move was found, show an error message
        if (!validMove) {
            this.showMessage("Invalid Move: Cannot move there", "failure");
        } else {
            this.selectedCell.cell.classList.remove('selected');
            this.selectedCell = undefined;

            if (this.checkMills(color, square, position)) {
                if (color == 'red') {
                    this.showMessage("Line!! Remove a piece!", "success");
                    this.stage = "remove";
                }
                else {
                    this.showMessage("Line!! AI remove a piece!", "failure");
                    setTimeout(() => {
                        let [AIsquare, AIposition] = this.randomPosition();
                        while (this.state[AIsquare][AIposition] !== 'red') {
                            [AIsquare, AIposition] = this.randomPosition();
                        }
                        const cell = document.getElementById(`${AIsquare}-${AIposition}`);
                        cell.classList.remove('red');
                        cell.classList.add('empty');
                        this.stage = "move";
                        this.redPiecesNumber -= 1;
                        setTimeout(() => {
                            if (this.redPiecesNumber <= 2) {
                                this.win('blue');
                            }
                        }, 500);
                    }, 500);
                }
            } else {
                this.toPlay = this.toPlay == 1 ? 0 : 1;
                if (this.toPlay == 1) setTimeout(() => this.AImove(), 500);
                if (this.toPlay == 0) {
                    if (this.checkValidMoves('red').length <= 0) {
                        this.showMessage("No possible moves!! Blue Plays!", "failure");
                        setTimeout(() => this.AImove(), 500);
                    }
                }
            };
        }
    }

    checkMills = (color, fromSquare, fromPosition) => {
        const directions = [
            [{ square: 1, position: 0 }, { square: 2, position: 0 }],
            [{ square: -1, position: 0 }, { square: -2, position: 0 }]
        ];

        if (fromPosition === 1 || fromPosition === 6) {
            directions.push([{ square: 0, position: 1 }, { square: 0, position: -1 }]);
        } else if (fromPosition === 3) {
            directions.push([{ square: 0, position: -3 }, { square: 0, position: 2 }]);
        } else if (fromPosition === 4) {
            directions.push([{ square: 0, position: 3 }, { square: 0, position: -2 }]);
        } else if (fromPosition === 0) {
            directions.push([{ square: 0, position: 1 }, { square: 0, position: 2 }]);
            directions.push([{ square: 0, position: 3 }, { square: 0, position: 5 }]);
        } else if (fromPosition === 5) {
            directions.push([{ square: 0, position: -2 }, { square: 0, position: -5 }]);
            directions.push([{ square: 0, position: 1 }, { square: 0, position: 2 }]);
        } else if (fromPosition === 2) {

            directions.push([{ square: 0, position: -1 }, { square: 0, position: -2 }]);
            directions.push([{ square: 0, position: 2 }, { square: 0, position: 5 }]);
        } else if (fromPosition === 7) {

            directions.push([{ square: 0, position: -1 }, { square: 0, position: -2 }]);
            directions.push([{ square: 0, position: -3 }, { square: 0, position: -5 }]);
        }

        for (let dir of directions) {
            let index = 1;

            if (Array.isArray(dir)) {
                for (let vec of dir) {
                    const newSquare = fromSquare + vec.square;
                    const newPosition = fromPosition + vec.position;

                    // Check if the new position is within bounds and empty
                    if (newSquare >= 0 && newSquare < this.size && this.state[newSquare][newPosition] == color) {
                        index++;
                        if (index == 3) return true;
                    } else break;
                }
            }
        }
        
        return false;
    }

    AImove = () => {
        if (this.stage === "move") {
            // Get all the valid move options for the AI (blue pieces)
            let validMoves = this.checkValidMoves('blue');
    
            // If there are valid moves, pick one randomly and execute it
 
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.selectedCell = new Object();
                this.selectedCell.cell = document.getElementById(`${randomMove.fromSquare}-${randomMove.fromPosition}`);
                this.selectedCell.position = randomMove.fromPosition;
                this.selectedCell.square = randomMove.fromSquare;
                this.move(randomMove.toSquare, randomMove.toPosition, "blue");
            } else {
                // No valid moves, you can decide to skip or take another action
                this.toPlay = 0;
                this.showMessage("No possible moves!! Red Plays!", "failure");
                return
            }
        }
    };

    checkValidMoves = (color) => {
        let validMoves = [];

        // Iterate over the entire board to find blue pieces
        for (let square = 0; square < this.state.length; square++) {
            for (let position = 0; position < 8; position++) {
                if (this.state[square][position] === color) {
                    // Check all possible moves for this piece
                    const directions = [
                        { square: 1, position: 0 },
                        { square: -1, position: 0 },
                    ];

                    if (position === 1 || position === 6) {
                        directions.push({ square: 0, position: 1 });
                        directions.push({ square: 0, position: -1 });
                    } else if (position === 3) {
                        directions.push({ square: 0, position: -3 });
                        directions.push({ square: 0, position: 2 });
                    } else if (position === 4) {
                        directions.push({ square: 0, position: 3 });
                        directions.push({ square: 0, position: -2 });
                    } else if (position === 0) {
                        directions.push({ square: 0, position: 1 });
                        directions.push({ square: 0, position: 3 });
                    } else if (position === 5) {
                        directions.push({ square: 0, position: -2 });
                        directions.push({ square: 0, position: 1 });
                    } else if (position === 2) {
                        directions.push({ square: 0, position: -1 });
                        directions.push({ square: 0, position: 2 });
                    } else if (position === 7) {
                        directions.push({ square: 0, position: -3 });
                        directions.push({ square: 0, position: -1 });
                    }

                    for (let dir of directions) {
                        const newSquare = square + dir.square;
                        const newPosition = position + dir.position;

                        // Check if the new position is within bounds and empty
                        if (newSquare >= 0 && newSquare < this.state.length && newPosition >= 0 && newPosition < 8) {
                            const targetCell = this.state[newSquare][newPosition];

                            // If the target cell is empty, it's a valid move
                            if (targetCell === 'empty') {
                                validMoves.push({ fromSquare: square, fromPosition: position, toSquare: newSquare, toPosition: newPosition });
                            }
                        }
                    }
                }
            }
        }

        return validMoves;
    }
    

    removePiece(square, position, pieceRemoving) {
        if (this.state[square][position] == pieceRemoving) this.state[square][position] = 'empty';
    }

    showMessage = (messageText, type) => {
        const message = document.createElement("div");
        message.setAttribute("class", "messageBox");
        message.innerText = messageText;

        if (type === "success") {
            this.successSound.play();
        } else if (type === "failure") {
            this.failureSound.play();
        } else if (type === "win") {
            this.winSound.play();
        }

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
        this.showMessage("Red has forsaken!!", "failure");
    
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