class LoginPage {
    constructor() {
        this.container = document.createElement("div"); 
        const logo = document.createElement("img");
        const buttonsContainer = document.createElement("div");
        const buttons = {
            "Login": document.createElement("button"),
            "Register": document.createElement("button")
        }


        this.container.setAttribute("class", "loginContainer");
        this.container.classList.add('up');
        this.container.setAttribute("id", "loginContainer");
        document.getElementsByTagName('body')[0].appendChild(this.container);
        
        this.container.appendChild(logo);
        logo.setAttribute("class", "logo")
        logo.setAttribute("src", "img/TWLogo.png")
        
        this.container.appendChild(buttonsContainer);
        buttonsContainer.setAttribute("class", "buttons")
        
        this.buttonsContainer = buttonsContainer;
        
        const buttonsFunctions = {
            "Login": async () => {
                await this.hide();

                this.loginForm = document.createElement("div");
                this.loginForm.setAttribute("class", "loginForm");
                
                const header = document.createElement("header");
                header.innerText = "Login";
                this.loginForm.appendChild(header);

                const form = document.createElement("form");
                this.loginForm.appendChild(form);

                const username = document.createElement("input");
                username.setAttribute("type", "text");
                username.setAttribute("placeholder", "Username");
                username.setAttribute("id", "username");

                const password = document.createElement("input");
                password.setAttribute("type", "password");
                password.setAttribute("placeholder", "Password");
                password.setAttribute("id", "password");

                const showPasswordContainer = document.createElement("div");
                showPasswordContainer.setAttribute("class", "showPasswordContainer")
                
                const showPasswordLabel = document.createElement("label");
                showPasswordLabel.setAttribute("name", "showPassword");
                showPasswordLabel.innerText = "Show Password"
                
                const showPassword = document.createElement("input");
                showPassword.setAttribute("name", "showPassword");
                showPassword.setAttribute("type", "checkbox");

                showPassword.addEventListener('change', () => {
                    const passwordInput = document.getElementById("password");
                    if (showPassword.checked) {
                        passwordInput.setAttribute("type", "text");
                    } else {
                        passwordInput.setAttribute("type", "password");
                    }
                });

                const loginButton = document.createElement("button");
                loginButton.innerText = "Login";
                loginButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.handleLogin();
                })
                
                showPasswordContainer.appendChild(showPassword);
                showPasswordContainer.appendChild(showPasswordLabel);

                form.appendChild(username);
                form.appendChild(password);
                form.appendChild(showPasswordContainer);
                form.appendChild(loginButton);
                
                document.getElementsByTagName('body')[0].appendChild(this.loginForm);
                
            }, 
            "Register": () => {},
        }
        
        for (let buttonIndex in buttons) {
            const button = buttons[buttonIndex];
            button.innerText = buttonIndex;
            button.addEventListener("click", () => buttonsFunctions[buttonIndex](button));
            buttonsContainer.appendChild(button);
        }      

    };

    handleLogin() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Basic frontend validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        // Simulate an authentication process
        if (true) { // Change these to test values
            this.loginForm.remove()
            this.transitionToMainPage(username);
        } else {
            alert("Invalid username or password.");
        }
    }

    // Transitions to the main page on successful login
    transitionToMainPage(username) {
        this.container.classList.add("hidden");
        this.destroy();
        new MainPage(username);
    }

    destroy() {
        // Remove login page elements
        this.container.remove();
        if (this.loginForm) this.loginForm.remove();

        // Nullify properties to allow for garbage collection
        this.container = null;
        this.loginForm = null;
    }

    hide = function() {
        return new Promise((resolve) => {
            this.container.classList.add('hidden');
            setTimeout(() => {
                this.container.style.display = 'none';
                resolve();
            }, 500)
        });
    }

    show = function() {
        this.container.style.display = 'flex';
        setTimeout(() => {
            this.container.classList.remove('hidden');
        }, 10)
    }
}

class MainPage {
    constructor(username) {
        this.container = document.createElement("div");
        const header = document.createElement("header");
        const main = document.createElement("main");
        const mainFooter = document.createElement("footer");
        this.actualExtra;

        this.actualPlayer = 1; // 0 Red, 1 Blue
        this.againstIA = true;
        this.IALevel = 1;
        this.size = 2;

        document.getElementsByTagName('body')[0].appendChild(this.container);
        this.container.style.display = 'none';
        this.container.setAttribute("class", "mainPageContainer");
        this.container.classList.add("hidden");

        this.container.appendChild(header);
        
        const logo = document.createElement("div");
        logo.setAttribute("class", "logo");
        header.appendChild(logo);
        
        const img = document.createElement("img");
        img.setAttribute("src", "img/TWLogo.png");
        img.setAttribute("alt", "gameLogo");
        logo.appendChild(img);

        const spanLogo = document.createElement("span");
        spanLogo.innerText = "TrilhaWeb";
        logo.appendChild(spanLogo);

        const userContainer = document.createElement("div");
        userContainer.setAttribute("class", "userContainer");
        
        const usernameDiv = document.createElement("div");
        usernameDiv.setAttribute("class", "usernameDiv");
        usernameDiv.innerText = username

        const logout = document.createElement("div");
        logout.setAttribute("class", "logout");
        logout.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i>`;
        logout.addEventListener("click", () => {
            this.hide();
            this.destroy();
            new LoginPage();
        });


        userContainer.appendChild(usernameDiv);
        userContainer.appendChild(logout);
        header.appendChild(userContainer);
        
        this.container.appendChild(main);

        this.gameContainer = document.createElement("div");
        this.gameContainer.setAttribute("class", "gameContainer");

        this.extraContainer = document.createElement("div");
        this.extraContainer.setAttribute("class", "extraContainer");

        this.configurationButton = document.createElement("div");
        this.configurationButton.setAttribute("class", "button");
        this.configurationButton.innerHTML = '<i class="fa-solid fa-gear"></i>';

        this.leaderButton = document.createElement("div");
        this.leaderButton.setAttribute("class", "button");
        this.leaderButton.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        this.leaderButton.addEventListener("click", () => {
            if (this.actualExtra == "leaderboard") {
                this.extraContainer.innerHTML = "";
                this.extraContainer.style.display = 'none';
                this.actualExtra = undefined;
            } else {
                this.actualExtra = "leaderboard";
                this.extraContainer.innerHTML = "";
                this.extraContainer.style.display = 'flex';
                
                const header = document.createElement("header");
                header.innerText = "Leaderboard";
                this.extraContainer.appendChild(header);

                const main = document.createElement("main")
                 
                this.extraContainer.appendChild(main);
            }
        });

        this.rulesButton = document.createElement("div");
        this.rulesButton.setAttribute("class", "button");
        this.rulesButton.innerHTML = '<i class="fa-solid fa-book"></i>';
        this.rulesButton.addEventListener("click", () => {
            if (this.actualExtra == "rules") {
                this.extraContainer.innerHTML = "";
                this.extraContainer.style.display = 'none';
                this.actualExtra = undefined;
            } else {
                this.actualExtra = "rules";
                this.extraContainer.innerHTML = "";
                this.extraContainer.style.display = 'flex';
                
                const header = document.createElement("header");
                header.innerText = "Rules / Instructions";
                this.extraContainer.appendChild(header);
                
                const main = document.createElement("main")
                main.innerHTML = 
                `
                <p>-Trilha é um jogo onde 2 jogadores tentam fazer com que o outro tenha só 2 peças restantes. O primeiro a conseguir isso, vence. É possível também que o jogo termine em empate. Para o jogo terminar empatado, basta que não existam mais jogadas válidas, ou então, se ambos os jogadores tiverem apenas 3 peças restantes, e em 10 jogadas nenhum deles conseguir eliminar uma peça inimiga, o jogo termina;</p>
                <br>
                <p>-O tabuleiro é composto por vários quadrados colocados um dentro do outro, com um limite de (colocar o limite de quadrados aqui) quadrados, e um mínimo de (colocar o mínimo de quadrados aqui) quadrados. Cada um deles tem sempre 8 lugares disponíveis para colocar peças, 1 em cada canto, e 1 no meio de cada lado do quadrado, sinalizados por círculos nessas posições;</p>
                <br>
                <p>-Os 2 jogadores começam sempre com o mesmo número de peças, que será dependente do número de quadrados escolhidos para jogar. Se o tabuleiro tiver n quadrados, cada jogador terá 3*n peças no início do jogo;</p>
                <br>
                <p>-Antes do jogo começar, os jogadores escolhem a sua cor e quem será o primeiro a jogar;</p>
                <br>
                <p>-Quando o jogo começa, ambos os jogadores colocam todas as suas peças onde quiserem no tabuleiro, um de cada vez, até que já não haja mais peças para colocar;</p>
                <br>
                <p>-Depois disso, podem mover qual peça queiram, desde que seja para um lugar vazio, e que seja adjacente à peça que querem mover. Lugares adjacentes são lugares conectados, verticalmente ou horizontalmente, pelas linhas do tabuleiro. Quando um jogador só tem 3 peças restantes, pode mover qualquer peça para qualquer lugar livre do tabuleiro;</p>
                <br>
                <p>-Para capturar peças do adversário, é necessário que se formem moinhos;</p>
                <br>
                <p>-Um moinho é uma sequência de 3 peças seguidas, verticalmente ou horizontalmente, da mesma cor;</p>
                <br>
                <p>-Com um moinho formado, o jogador pode remover qualquer peça do adversário, desde que essa peça não pertença a um moinho adversário, a não ser que só existam peças restantes em moinhos adversários;</p>
                <br>
                <p>-Cada moinho só pode eliminar uma peça do inimigo. Para um mesmo moinho voltar a eliminar uma peça inimiga, alguma peça desse moinho terá que se mover, para depois voltar a formá-lo novamente;</p>
                <br>
                <p>-Um moinho formado durante a fase em que os jogadores distribuem as peças pelo tabuleiro não pode eliminar uma peça inimiga imediatamente. Para o fazer, será necessário que uma peça desse moinho se mova, e volte a formar o moinho;</p>
                `;
                
                this.extraContainer.appendChild(main);
            }
        });

        this.board = document.createElement("div");
        this.board.setAttribute("class", "board");

        this.configPopUp = new ConfigPopup(this);
        this.configurationButton.addEventListener("click", this.configPopUp.toggle);

        this.startGame = document.createElement("div");
        this.startGame.innerHTML = '<i class="fa-solid fa-play"></i> Start Game';
        this.startGame.setAttribute("class", "startGame");
        this.board.appendChild(this.startGame);

        this.startGame.addEventListener("click", () => {
            this.startGame.style.display = 'none';
            this.actualGame = new Board(this, this.size, this.actualPlayer, this.IALevel);
        });
        
        const footer = document.createElement("footer");
        const buttonsFooter = document.createElement("div");
        buttonsFooter.setAttribute("class", "buttonsFooter");

        buttonsFooter.appendChild(this.leaderButton);
        buttonsFooter.appendChild(this.configurationButton);
        buttonsFooter.appendChild(this.rulesButton);
        footer.appendChild(buttonsFooter);


        this.gameContainer.appendChild(this.board);
        this.gameContainer.appendChild(footer);

        main.appendChild(this.gameContainer);
        main.appendChild(this.extraContainer);
        this.extraContainer.style.display = 'none';

        this.container.appendChild(mainFooter);
        mainFooter.innerHTML = "&copy;TrilhaWeb FCUP";

        this.show();
    };

    hide = function() {
        this.container.classList.add('hidden');
        setTimeout(() => {
            this.container.style.display = 'none';
            window.loginPage.show();
        }, 500)
    }

    show = function() {
        this.container.style.display = 'flex';
        setTimeout(() => {
            this.container.classList.remove('hidden');
        }, 10);
    }

    destroy() {
        // Remove all elements associated with the main page
        if (this.container) this.container.remove();

        // Nullify properties to help with garbage collection
        this.container = null;
        this.trilhaGame = null;
        this.actualExtra = null;
    }
}

class Board {
    constructor(mainPage, size, firstToPlay, IALevel) {
        this.state = new Array(size);
        this.mainPage = mainPage;
        this.stage = "placement";
        this.firstToPlay = firstToPlay;

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
        this.middle.appendChild(game);

        const forsake = document.createElement("div");
        forsake.innerHTML = 'Forsake';
        forsake.setAttribute("class", "forsake");
        this.middle.appendChild(forsake);
        forsake.addEventListener("click", () => {
            forsake.remove();
            this.forsake();
        })

        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell", this.state[i][j]);
                cell.setAttribute("id", `${i}-${j}`);
                const hrule = document.createElement("div");
                hrule.classList.add("hrule");
        
                // Optionally, add a click event or drag/drop functionality here
                // cell.addEventListener("click", () => handleCellClick(i, j));
        
                game.appendChild(cell);
                game.appendChild(hrule);
            }
        }

        console.log(this.state);

        mainPage.board.appendChild(this.redPiecesContainer);
        mainPage.board.appendChild(this.middle);
        mainPage.board.appendChild(this.bluePiecesContainer);

        
        if (this.firstToPlay == 0) {
            this.showMessage("It's Red Turn!!", "success");
            this.play();
        } else {
            //this.showMessage("It's Red Turn!!", "success");
            //this.forsake();
        }

    }

    play(square, position) {
        if (this.state[line][collumn]);
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

class ConfigPopup {
    constructor(boardObj) {
        this.popup = document.createElement("div");
        this.popup.style.display = 'none';
        this.popup.setAttribute("class", "popup");

        boardObj.board.appendChild(this.popup);

        const header = document.createElement("header");
        this.popup.appendChild(header);
        header.innerText = "Settings"

        const form = document.createElement("form");


        const size = new Selector("Tamanho: ", [1, 2, 3], (value) => {boardObj.againstIA = value+1});
        const versus = new Selector("Versus: ", ["IA", "PvP"], (value) => {boardObj.againstIA = value});
        const firstToPlay = new Selector("First To Play: ", ["Red", "Blue"], (value) => {boardObj.actualPlayer = value});
        const IALevel = new Selector("IA Level: ", ["Easy", "Mid", "Hard"], (value) => {boardObj.IALevel = value});

        form.appendChild(size.container);
        form.appendChild(versus.container);
        form.appendChild(firstToPlay.container);
        form.appendChild(IALevel.container);

        this.popup.appendChild(form);
    }

    toggle = () => {
        if (this.popup.style.display == 'inline') {
            this.popup.style.display = 'none';
        } else this.popup.style.display = 'inline';
    }


}

class Selector {

    constructor(labelText, valuesArray, func) {

        this.values = valuesArray;
        this.actualPosition = 0;
        this.func = func;

        this.container = document.createElement("div");
        this.container.setAttribute("class", "selector");
        
        const label = document.createElement("div");
        label.innerText = labelText;
        this.container.appendChild(label);
        
        const valueContainer = document.createElement("div");
        valueContainer.setAttribute("class", "valueContainer");
        
        this.value = document.createElement("div");
        this.value.setAttribute("class", "value");
        this.value.innerHTML = this.values[this.actualPosition];
        
        const rightArrow = document.createElement("div");
        rightArrow.setAttribute("class", "arrow");
        rightArrow.addEventListener("click", () => {this.moveOption(1)});
        
        const leftArrow = document.createElement("div");
        leftArrow.setAttribute("class", "arrow");
        leftArrow.addEventListener("click", () => {this.moveOption(-1)});
        
        valueContainer.appendChild(leftArrow);
        leftArrow.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
        valueContainer.appendChild(this.value);
        valueContainer.appendChild(rightArrow);
        rightArrow.innerHTML = '<i class="fa-solid fa-angle-right"></i>';

        this.container.appendChild(valueContainer);

    }

    moveOption = (index) => {
        this.actualPosition += index;
        if (this.actualPosition <= -1) this.actualPosition = this.values.length-1;
        if (this.actualPosition >= this.values.length) this.actualPosition = 0;
        this.value.innerHTML = this.values[this.actualPosition];
        this.func(this.actualPosition);
    }
}

window.onload = function() {
    
    new LoginPage();

    // window.mainPage = new MainPage(); // window object garants global acess
}