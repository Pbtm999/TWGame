import { myCreateElement } from '../utils.js';
import { MainPage } from './MainPage.js';

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
            "Register": document.createElement("button")
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
                    this.handleLogin();
                })
                
            }, 
            "Register": () => {},
        }
        
        for (let buttonIndex in buttons) {
            const button = buttons[buttonIndex];
            button.innerText = buttonIndex;
            button.addEventListener("click", () => buttonsFunctions[buttonIndex](button));
            this.buttonsContainer.appendChild(button);
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