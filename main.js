class LoginPage {
    constructor() {
        this.container = document.createElement("div"); 
        this.logo = document.createElement("img");
        this.buttonsContainer = document.createElement("div");
        this.buttons = {
            "Login": document.createElement("button"),
            "Autenticar": document.createElement("button")
        }


        this.container.setAttribute("class", "loginContainer");
        this.container.setAttribute("id", "loginContainer");
        document.getElementsByTagName('body')[0].appendChild(this.container);

        this.container.appendChild(this.logo);
        this.logo.setAttribute("class", "logo")
        this.logo.setAttribute("src", "img/TWLogo.png")
        
        this.container.appendChild(this.buttonsContainer);
        this.buttonsContainer.setAttribute("class", "buttons")

        for (let buttonIndex in this.buttons) {
            const button = this.buttons[buttonIndex];
            
            button.innerText = buttonIndex;
            button.addEventListener("click", () => this.hide());
            this.buttonsContainer.appendChild(button);
            
        }      

    };

    hide = function() {
        this.container.classList.add('hidden');
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 500)

    }

    show = function() {
        this.container.style.display = 'flex';
        setTimeout(() => {
            this.container.classList.remove('hidden');
        }, 10)
    }
}

window.onload = function() {
    let loginPage = new LoginPage();
}