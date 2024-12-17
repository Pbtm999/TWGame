import { addIcon, myCreateElement } from "../utils.js";
import { ConfigPopup } from "./ConfigPopup.js";
import { LeaderBoard } from "./LeaderBoard.js";
import { LoginPage } from "./LoginPage.js";
import { AIBoard } from "./AIBoard.js";
import { Board } from "./Board.js";
import SERVER_URL from "../config.js";

export class MainPage {
    constructor(username, password) {

        var actualExtra = undefined;
        this.config = {
            size: 1,
            firstColorToPlay: "Red",
            playerColor: "Red",
            PvP: true
        }
        
        this.container = myCreateElement("div", [["class", "mainPageContainer hidden"], ["style", "display: none;"]], "body");
        this.username = username;
        
        const header = myCreateElement("header", [], this.container);
        const main = myCreateElement("main", [], this.container);
        const mainFooter = myCreateElement("footer", [], this.container);
        mainFooter.innerHTML = "&copy;TrilhaWeb FCUP";
        
        const logo = myCreateElement("div", [["class", "logo"]], header);
        
        myCreateElement("img", [["src", "img/TWLogo.png"], ["alt", "gameLogo"]], logo);

        const spanLogo = myCreateElement("span", [], logo);
        spanLogo.innerText = "TrilhaWeb";

        const userContainer = myCreateElement("div", [["class", "userContainer"]], header);
        const usernameDiv = myCreateElement("div", [["class", "usernameDiv"]], userContainer);
        usernameDiv.innerText = username;

        const logout = myCreateElement("div", [["class", "logout"]], userContainer);
        addIcon(logout, "fa-solid fa-right-from-bracket");
        logout.addEventListener("click", () => {
            this.destroy();
            if (this.actualGame) this.actualGame.forsake();
            new LoginPage();
        });

        const gameContainer = myCreateElement("div", [["class", "gameContainer"]], main);
        const extraContainer = myCreateElement("div", [["class", "extraContainer"], ["style", "display: none;"]], main);

        const board = myCreateElement("div", [["class", "board"]], gameContainer);
        this.board = board

        this.startGame = myCreateElement("div", [["class", "startGame"]], board);
        // addIcon(this.startGame, "fa-solid fa-play");
        this.startGame.innerText = 'Start Game';

        const leaderboardObj = new LeaderBoard(extraContainer);
        this.leaderboardObj = leaderboardObj;
        this.startGame.addEventListener("click", () => {
            this.startGame.style.display = 'none';
            if (this.config.PvP) {
               
                fetch(`http://${SERVER_URL}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({group: 146, nick: username, password: password, size: this.config.size})
                })
                .then(response => {
                    if (response.ok) {
                        response.json()
                        .then(data => {     
                            this.actualGame = new Board(this, username, password, data.game, this.config.size);
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                
            } else
                this.actualGame = new AIBoard(this, this.config, leaderboardObj);
        });

        const gameContainerFooter = myCreateElement("footer", [], gameContainer);
        const buttonsgameContainer = myCreateElement("div", [["class", "buttonsFooter"]], gameContainerFooter);

        const configurationButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(configurationButton, "fa-solid fa-gear");

        const configPopup = new ConfigPopup(this.config, board);
        configurationButton.addEventListener("click", configPopup.toggle);

        const leaderButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(leaderButton, "fa-solid fa-trophy");
        leaderButton.addEventListener("click", () => {
            if (actualExtra == "leaderboard") {
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'none';
                actualExtra = undefined;
            } else {
                actualExtra = "leaderboard";
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'flex';
                
                const header = myCreateElement("header", [], extraContainer);
                header.innerText = "Leaderboard AI";
                
                const main = myCreateElement("main", [["style", "overflowY: 'none';"]], extraContainer);
                
                if (leaderboardObj.ranking[this.config.size] !== undefined) {
                    for (let i = 0; i < leaderboardObj.ranking[this.config.size].length; i++) {
                        const score = myCreateElement("div", [["class", "score"]], main);
                        score.innerText = `${i+1}. ${leaderboardObj.ranking[this.config.size][i][1]} : ${leaderboardObj.ranking[this.config.size][i][0]}`
                    }
                }

                const footer = myCreateElement("footer", [], extraContainer);
                var buttons = [
                    myCreateElement("div", [["class", "button"]], footer),
                    myCreateElement("div", [["class", "button"]], footer)
                ];
                buttons[0].innerText = "PvP";
                buttons[1].innerText = "AI";
                for (let btn of buttons) {
                    btn.addEventListener("click", () => {
                        while (main.lastElementChild) {
                            main.removeChild(main.lastElementChild);
                        }
                        header.innerText = `Leaderboard ${btn.innerText}`;
                        if (btn.innerText == "PvP") {
                            
                            fetch(`http://${SERVER_URL}/ranking`, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify({group: 146, size: this.config.size})
                            })
                            .then(response => {
                                if (response.ok) {
                                    response.json()
                                    .then(data => {
                                        for (let i = 0; i < data.ranking.length; i++) {
                                            const usr = data.ranking[i]
                                            const score = myCreateElement("div", [["class", "score"]], main);
                                            score.innerText = `${i+1}. ${usr.nick} : ${usr.victories}-${usr.games}`;
                                        }
                                    })
                                } else {
                                    response.json()
                                    .then(data => {     
                                        console.log(data.error);
                                        score.innerText = "";
                                    })
                                }
                            })
                            



                        } else {
                            if (leaderboardObj.ranking[this.config.size] !== undefined) {
                                for (let i = 0; i < leaderboardObj.ranking.length; i++) {
                                    const score = myCreateElement("div", [["class", "score"]], main);
                                    score.innerText = `${i+1}. ${leaderboardObj.ranking[i][1]} : ${leaderboardObj.ranking[i][0]}`
                                }
                            }
                        }
                    });
                }
                
            }
        });

        const rulesButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(rulesButton, "fa-solid fa-book")
        rulesButton.addEventListener("click", () => {
            if (actualExtra == "rules") {
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'none';
                actualExtra = undefined;
            } else {
                actualExtra = "rules";
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'flex';
                
                const header = myCreateElement("header", [], extraContainer);
                header.innerText = "Rules / Instructions";
                
                const main = myCreateElement("main", [["style", "overflowY: scroll;"]], extraContainer);

                const gameRules = [
                    "- Trilha é um jogo onde 2 jogadores tentam fazer com que o outro tenha só 2 peças restantes. O primeiro a conseguir isso, vence. É possível também que o jogo termine em empate. Para o jogo terminar empatado, basta que não existam mais jogadas válidas, ou então, se ambos os jogadores tiverem apenas 3 peças restantes, e em 10 jogadas nenhum deles conseguir eliminar uma peça inimiga, o jogo termina;",
                    "- O tabuleiro é composto por vários quadrados colocados um dentro do outro, com um limite de 3 quadrados, e um mínimo de 1 quadrado. Cada um deles tem sempre 8 lugares disponíveis para colocar peças, 1 em cada canto, e 1 no meio de cada lado do quadrado, sinalizados por círculos nessas posições;",
                    "- Os 2 jogadores começam sempre com o mesmo número de peças, que será dependente do número de quadrados escolhidos para jogar. Se o tabuleiro tiver n quadrados, cada jogador terá 3*n peças no início do jogo;",
                    "- Antes do jogo começar, os jogadores escolhem a sua cor e quem será o primeiro a jogar;",
                    "- Quando o jogo começa, ambos os jogadores colocam todas as suas peças onde quiserem no tabuleiro, um de cada vez, até que já não haja mais peças para colocar;",
                    "- Depois disso, podem mover qual peça queiram, desde que seja para um lugar vazio, e que seja adjacente à peça que querem mover. Lugares adjacentes são lugares conectados, verticalmente ou horizontalmente, pelas linhas do tabuleiro. Quando um jogador só tem 3 peças restantes, pode mover qualquer peça para qualquer lugar livre do tabuleiro;",
                    "- Para capturar peças do adversário, é necessário que se formem moinhos;",
                    "- Um moinho é uma sequência de 3 peças seguidas, verticalmente ou horizontalmente, da mesma cor;",
                    "- Com um moinho formado, o jogador pode remover qualquer peça do adversário, desde que essa peça não pertença a um moinho adversário, a não ser que só existam peças restantes em moinhos adversários;",
                    "- Cada moinho só pode eliminar uma peça do inimigo. Para um mesmo moinho voltar a eliminar uma peça inimiga, alguma peça desse moinho terá que se mover, para depois voltar a formá-lo novamente;",
                    "- Um moinho formado durante a fase em que os jogadores distribuem as peças pelo tabuleiro não pode eliminar uma peça inimiga imediatamente. Para o fazer, será necessário que uma peça desse moinho se mova, e volte a formar o moinho;"
                ];
                gameRules.forEach(rule => {
                    const paragraph = myCreateElement('p', [], main);
                    paragraph.textContent = rule;
                });
            }
        });

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
        this.config = null;
    }


}