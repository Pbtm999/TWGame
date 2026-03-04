import { myCreateElement, Selector } from "../utils.js";

export class ConfigPopup {
    constructor(config, boardElement) {
        // Create the popup container
        const popup = myCreateElement("div", [["class", "popup"], ["style", "display: none;"]], boardElement);
        this.popup = popup

        // Create and append the header
        const header = myCreateElement("header", [["class", "popupHeader"]], popup);
        header.innerText = "Settings";

        // Create the form
        const form = myCreateElement("form", [], popup);

        const colors = ["Red", "Blue"]
        // Create Selectors
        new Selector("Tamanho: ", [1, 2, 3], (value) => { config.size = value + 1 }, form);
        new Selector("FirstPlay: ", colors, (value) => { config.firstColorToPlay = colors[value] }, form);
        new Selector("PlayerColor: ", colors, (value) => { config.playerColor = colors[value] }, form);
        new Selector("PvP: ", ["True", "False"], (value) => { config.PvP = value == "True" ? true : false }, form);
    }

    toggle = () => { this.popup.style.display = this.popup.style.display === 'inline' ? "none" : "inline"; }

}