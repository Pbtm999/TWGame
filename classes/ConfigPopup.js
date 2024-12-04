import { myCreateElement, Selector } from "../utils.js";

export class ConfigPopup {
    constructor(boardObj, boardElement) {
        // Create the popup container
        this.popup = myCreateElement("div", [["class", "popup"], ["style", "display: none;"]], boardElement);

        // Create and append the header
        const header = myCreateElement("header", [], this.popup);
        header.innerText = "Settings";

        // Create the form
        const form = myCreateElement("form", [], this.popup);

        // Create Selectors
        new Selector("Tamanho: ", [1, 2, 3], (value) => { boardObj.size = value + 1 }, form);
        new Selector("Versus: ", ["IA", "PvP"], (value) => { boardObj.againstIA = value }, form);
        new Selector("First To Play: ", ["Red", "Blue"], (value) => { boardObj.actualPlayer = value }, form);
        new Selector("IA Level: ", ["Easy", "Mid", "Hard"], (value) => { boardObj.IALevel = value }, form);
    }

    toggle = () => { this.popup.style.display = this.popup.style.display === 'inline' ? "none" : "inline"; }


}