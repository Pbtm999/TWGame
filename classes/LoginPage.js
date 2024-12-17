import { myCreateElement } from '../utils.js';
import { MainPage } from './MainPage.js';
import SERVER_URL from "../config.js";

export class LoginPage {
    constructor() {
        // Creates the div element who represents the login container
        this.container = myCreateElement("div", [["id", "loginContainer"], ["class", "loginContainer up"]], "body");
        
        // Logo
        myCreateElement("img", [["class", "logo"], ["src", "img/TWLogo.png"]], this.container);

        // Buttons
        this.buttonsContainer = myCreateElement("div", [["class", "buttons"]], this.container);
        
        const buttons = {
            "Login": document.createElement("button"),
        }

        const buttonsFunctions = {
            "Login": async () => {
                await this.hide();

                this.loginForm = myCreateElement("div", [["class", "loginForm"]], "body");
                
                const header = myCreateElement("header", [], this.loginForm);
                header.innerText = "Login";

                const form = myCreateElement("form", [], this.loginForm)
                myCreateElement("input", [["type", "text"], ["placeholder", "Username"], ["id", "username"]], form);
                myCreateElement("input", [["type", "password"], ["placeholder", "Password"], ["id", "password"]], form);
                const errorP = myCreateElement("p", [["class", "error"]], form);

                const showPasswordContainer = myCreateElement("div", [["class", "showPasswordContainer"]], form);
                
                const showPassword = myCreateElement("input", [["name", "showPassword"], ["type", "checkbox"]], showPasswordContainer);
                showPassword.addEventListener('change', () => {
                    const passwordInput = document.getElementById("password");
                    if (showPassword.checked) {
                        passwordInput.setAttribute("type", "text");
                    } else {
                        passwordInput.setAttribute("type", "password");
                    }
                });

                const showPasswordLabel = myCreateElement("label", [["name", "showPassword"]], showPasswordContainer);
                showPasswordLabel.innerText = "Show Password"

                const loginButton = myCreateElement("button", undefined, form);
                loginButton.innerText = "Login";
                loginButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.handleLogin(errorP);
                })
            }
        }
        
        for (let buttonIndex in buttons) {
            const button = buttons[buttonIndex];
            button.innerText = buttonIndex;
            button.addEventListener("click", () => buttonsFunctions[buttonIndex](button));
            this.buttonsContainer.appendChild(button);
        }      

    };

    handleLogin(errorP) {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        
        // Basic frontend validation
        if (!username || !password) {
            errorP.style.display = 'block';
            errorP.innerText = "Please enter both username and password.";
            return;
        }

        //twserver.alunos.dcc.fc.up.pt
        fetch(`http://${SERVER_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({nick: username, password: password})
        })
        .then(response => {
            if (response.ok) {
                this.loginForm.remove()
                this.transitionToMainPage(username, password);
            } else {
                errorP.innerText = "Credênciais errados!";
                errorP.style.display = 'block';
            }
        })
    }

    // Transitions to the main page on successful login
    transitionToMainPage(username, password) {
        this.container.classList.add("hidden");
        this.destroy();
        new MainPage(username, password);
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