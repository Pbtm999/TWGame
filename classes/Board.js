import { playSound, generateBoard, myCreateElement } from "../utils.js";
import SERVER_URL from "../config.js";

export class Board {
    constructor(mainPage, username, password, gameId, size) {

        const gameEvent = new EventSource(`http://${SERVER_URL}/update?nick=${username}&game=${gameId}`); //
        gameEvent.onmessage = (event) => {
            const gameData = JSON.parse(event.data);
            if (gameData.board === undefined && Object.prototype.hasOwnProperty.call(gameData, 'winner') && gameData.winner === null) {
                gameEvent.close();
            } else if (gameData.board === undefined && gameData.winner) {
                gameEvent.close();
                if (this.state !== undefined) this.win(gameData.winner);
            } else {
                if (this.state === undefined) {
                    this.state = gameData.board;
                    this.phase = gameData.phase;
                    this.step = gameData.step;
                    this.turn = gameData.turn;
                    this.playerColor = gameData.players[username];
    
                    this.queueWrapper.remove();
                    this.queueWrapper = null;
    
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
    
                    const forsake = myCreateElement("div", [["class", "forsake"]], this.middle);
                    forsake.innerHTML = 'Forsake';
                    forsake.addEventListener("click", () => {
                        this.forsake();
                    })
    
                    game.addEventListener("click", (event) => {

                        const selectionHandle = (cell) => {
                            
                            if (cell.classList.contains("selected")) {
                                cell.classList.remove("selected");
                                this.selectedCell = null;
                                return;
                            }
                            
                            if (this.selectedCell) {
                                this.selectedCell.classList.remove("selected");
                            } else {
                                cell.classList.add("selected");
                                this.selectedCell = cell;
                            }
                    

                        }

                        if (event.target.classList.contains("cell")) {
                            const cell = event.target;
                            const [square, position] = cell.id.split("-").map(Number);

                            if (this.phase != "drop") 
                                selectionHandle(cell);
    
                            fetch(`http://${SERVER_URL}/notify`, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify({nick: this.username, password: this.password, game: this.gameId, cell: {square: square, position: position}})
                            })
                            .then(response => {
                                if (!response.ok) {
                                    response.json()
                                    .then(data => {
                                        this.showMessage(`${data.error}`, "failure");
                                        if (this.selectedCell) {
                                            if (this.selectedCell.classList.contains("selected")) {
                                                this.selectedCell.classList.remove("selected");
                                                this.selectedCell = null;
                                            } else {
                                                this.selectedCell.classList.add("selected");
                                            }
                                        }
                                    })
                                } else {
                                    playSound("success");
                                }
                            })
                        }
                    })
    
                    this.showMessage(`${this.turn} turn!`, "success");
                } else if (!(gameData.phase == "move" && gameData.step == "to")) {

                    if (Object.prototype.hasOwnProperty.call(gameData, 'winner') && gameData.winner === null)
                        this.draw();
                    else if (gameData.winner) {
                        gameEvent.close();
                        if (this.state !== undefined) this.win(gameData.winner);
                    } else {
                        if (this.turn != gameData.turn) {
                            this.showMessage(`${gameData.turn} turn!`, "success");
                            if (this.phase == "drop") {
                                const color = this.turn == username ? this.playerColor : (this.playerColor == "red" ? "blue" : "red");
                                if (color === 'red') this.redPiecesContainer.removeChild(this.redPiecesContainer.children[0]);
                                else this.bluePiecesContainer.removeChild(this.bluePiecesContainer.children[0]);  
                            }
                        }
                    }

                    
                    if (gameData.step == "take")
                        this.showMessage(`${gameData.turn} did Moinho!`, "success");
                    
                    this.state = gameData.board;
                    this.phase = gameData.phase;
                    this.step = gameData.step;
                    this.turn = gameData.turn;

                    for (var square = 0; square < size; square++) {
                        for (var position = 0; position < 8; position++) {
                            const cell = document.getElementById(`${square}-${position}`);
                            
                            if (this.state[square][position] != 'empty') {
                                cell.classList.remove("empty");
                                cell.classList.add(this.state[square][position] === 'red' ? "red" : "blue");
                            } else {
                                cell.classList.add("empty");
                                cell.classList.remove('red');
                                cell.classList.remove('blue');
                            }
                        }
                    }

                    
                }
            }
            
            
        }

        gameEvent.onerror = (e) => {

            if (this.queueWrapper)
                this.queueWrapper.remove();
            if (this.redPiecesContainer)
                this.redPiecesContainer.remove();
            if (this.middle)
                this.middle.remove();
            if (this.bluePiecesContainer)
                this.bluePiecesContainer.remove();

            this.redPiecesContainer = null;
            this.middle = null;
            this.bluePiecesContainer = null;
            this.queueWrapper = null;

            mainPage.actualGame = null;
            mainPage.startGame.style.display = 'inline';
            
            gameEvent.close();
        }

        this.mainPage = mainPage;
        this.username = username;
        this.password = password;
        this.gameId = gameId;


        this.redPiecesContainer = myCreateElement("div", [["class", "redPiecesContainer"]], mainPage.board);
        this.middle = myCreateElement("div", [["class", "middle"]], mainPage.board);
        this.bluePiecesContainer = myCreateElement("div", [["class", "bluePiecesContainer"]], mainPage.board);

        this.queueWrapper = myCreateElement("div", [["class", "queueWrapper"]], this.middle);
        myCreateElement("div", [["class", "queueText"]], this.queueWrapper).innerText = "In Queue...";
        myCreateElement("canvas", [["id", "loadingCircle"], ["width", "150"], ["height", "150"]], this.queueWrapper)

        const canvas = document.getElementById('loadingCircle');
        const ctx = canvas.getContext('2d');

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50;
        const lineWidth = 8;

        let startAngle = 0;
        const endAngle = Math.PI * 1.5; // 270 degrees

        function drawLoadingCircle() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = '#ddd';
            ctx.stroke();

            // Draw the animated arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + endAngle);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = '#000';
            ctx.lineCap = 'round';
            ctx.stroke();

            startAngle += 0.05;
            requestAnimationFrame(drawLoadingCircle);
        }

        drawLoadingCircle();

        const cancelQueue = myCreateElement("div", [["class", "queueCancel"]], this.queueWrapper)
        cancelQueue.innerText = "Cancel Queue";

        cancelQueue.addEventListener("click", () => {
            if (this.queueWrapper)
                this.queueWrapper.remove();
            if (this.redPiecesContainer)
                this.redPiecesContainer.remove();
            if (this.middle)
                this.middle.remove();
            if (this.bluePiecesContainer)
                this.bluePiecesContainer.remove();

            this.redPiecesContainer = null;
            this.middle = null;
            this.bluePiecesContainer = null;
            this.queueWrapper = null;

            fetch(`http://${SERVER_URL}/leave`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({nick: username, password: password, game: gameId})
            })

            mainPage.actualGame = null;
            mainPage.startGame.style.display = 'inline';

        });

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
        fetch(`http://${SERVER_URL}/leave`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({nick: this.username, password: this.password, game: this.gameId})
        })
    }

    win = (username) => {
        this.showMessage(`${username} Wins!`, 'win');

        setTimeout(() => {
            if (this.queueWrapper)
                this.queueWrapper.remove();
            if (this.redPiecesContainer)
                this.redPiecesContainer.remove();
            if (this.middle)
                this.middle.remove();
            if (this.bluePiecesContainer)
                this.bluePiecesContainer.remove();

            this.mainPage.actualGame = null;
            this.mainPage.startGame.style.display = 'inline';
        }, 2000);
    }

    draw = () => {
        this.showMessage(`Draw!`, 'win');

        setTimeout(() => {
            if (this.queueWrapper)
                this.queueWrapper.remove();
            if (this.redPiecesContainer)
                this.redPiecesContainer.remove();
            if (this.middle)
                this.middle.remove();
            if (this.bluePiecesContainer)
                this.bluePiecesContainer.remove();

            this.mainPage.actualGame = null;
            this.mainPage.startGame.style.display = 'inline';
        }, 2000);
    }


}