import { addIcon, myCreateElement } from "../utils.js";
import { ConfigPopup } from "./ConfigPopup.js";
import { LeaderBoard } from "./LeaderBoard.js";
import { Board } from "./Board.js";

export class MainPage {
    constructor(username) {

        this.username = username
        this.actualPlayer = 0; // 0 Red, 1 Blue
        this.againstIA = 0;
        this.IALevel = 0;
        this.size = 1;
        this.actualExtra = undefined;
        
        this.container = myCreateElement("div", [["class", "mainPageContainer hidden"], ["style", "display: none;"]], "body");
        
        const header = myCreateElement("header", [], this.container);
        const main = myCreateElement("main", [], this.container);
        const mainFooter = myCreateElement("footer", [], this.container);
        mainFooter.innerHTML = "&copy;TrilhaWeb FCUP";
        
        const logo = myCreateElement("div", [["class", "logo"]], header);
        
        myCreateElement("img", [["src", "img/TWLogo.png"], ["alt", "gameLogo"]], logo);

        const spanLogo = myCreateElement("span", [], logo);
        spanLogo.innerText = "TrilhaWeb";

        const userContainer = myCreateElement("div", ["class", "userContainer"], header);
        
        const usernameDiv = myCreateElement("div", [["class", "usernameDiv"]], userContainer);
        usernameDiv.innerText = username;

        const logout = myCreateElement("div", [["class", "logout"]], header);
        addIcon(logout, "fa-solid fa-right-from-bracket");
        logout.addEventListener("click", () => {
            this.hide();
            this.destroy();
            new LoginPage();
        });

        const gameContainer = myCreateElement("div", [["class", "gameContainer"]], main);
        const extraContainer = myCreateElement("div", [["class", "extraContainer"], ["style", "display: none;"]], main);

        const board = myCreateElement("div", [["class", "board"]], gameContainer);

        this.startGame = myCreateElement("div", [["class", "startGame"]], board);
        // addIcon(this.startGame, "fa-solid fa-play");
        this.startGame.innerText = 'Start Game';

        this.startGame.addEventListener("click", () => {
            this.startGame.style.display = 'none';
            this.actualGame = new Board(this, this.size, this.actualPlayer, this.IALevel, this.leaderboardObj);
        });

        const gameContainerFooter = myCreateElement("footer", [], gameContainer);
        const buttonsgameContainer = myCreateElement("div", [["class", "buttonsFooter"]], gameContainerFooter);

        const configurationButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(configurationButton, "fa-solid fa-gear");

        const configPopup = new ConfigPopup(this, board);
        configurationButton.addEventListener("click", configPopup.toggle);

        const leaderboardObj = new LeaderBoard(extraContainer);
        const leaderButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(leaderButton, "fa-solid fa-trophy");
        leaderButton.addEventListener("click", () => {
            if (this.actualExtra == "leaderboard") {
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'none';
                this.actualExtra = undefined;
            } else {
                this.actualExtra = "leaderboard";
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'flex';
                
                const header = myCreateElement("header", [], extraContainer);
                header.innerText = "Leaderboard";
                
                const main = myCreateElement("main", [["style", "overflowY: 'none';"]], extraContainer)
                
                for (let i = 0; i < leaderboardObj.array.length; i++) {
                    const score = myCreateElement("div", [["class", "score"]], main);
                    score.innerText = `${i+1}. ${leaderboardObj.array[i][1]} : ${leaderboardObj.array[i][0]}`
                }
            }
        });

        const rulesButton = myCreateElement("div", [["class", "button"]], buttonsgameContainer);
        addIcon(rulesButton, "fa-solid fa-book")
        rulesButton.addEventListener("click", () => {
            if (this.actualExtra == "rules") {
                extraContainer.innerHTML = "";
                extraContainer.style.display = 'none';
                this.actualExtra = undefined;
            } else {
                this.actualExtra = "rules";
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
        this.trilhaGame = null;
        this.actualExtra = null;
    }
}