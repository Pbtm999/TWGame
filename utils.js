export const myAppendChild = (appendTo, element) => {
    if (appendTo !== null) {
        if (appendTo === "body")
            document.body.appendChild(element);
        else if (appendTo instanceof HTMLElement)
            appendTo.appendChild(element);

    }
}

export const playSound = (sound) => {
    // Sounds: success / win / failure
    new Audio(`audios/${sound}.mp3`).play();
}

export const myCreateElement = (tag, attributes = [], appendTo = null) => {
    // Creates an element of the tag passed as argument
    const element = document.createElement(tag);
    
    // Add or set determined atribute to the element
    for (const [attribute, value] of attributes) {
        if (attribute === "class")
            value.split(" ").forEach(cls => element.classList.add(cls));
        else if (attribute === "style") {
            value.split(";").forEach(sty => {
                const [styleProperty, styleValue] = sty.split(":").map(s => s.trim());
                element.style[styleProperty] = styleValue
            });
            
        }
        else 
            element.setAttribute(attribute, value);
    }
    
    // Appends the elment to a specified container element
    myAppendChild(appendTo, element)

    return element; // Return the element

}

export const addIcon = (appendTo, icon) => {
    const iconElement = myCreateElement("i", [["class", icon]])

    // Appends the elment to a specified container element
    myAppendChild(appendTo, iconElement)
}

export class Selector {

    constructor(labelText, valuesArray = [], f, appendTo) {

        this.values = valuesArray;
        this.actualPosition = 0;
        this.f = f;

        const container = myCreateElement("div", [["class", "selector"]], appendTo)
        
        const label = myCreateElement("div", [], container);
        label.innerText = labelText;
        
        const valueContainer = myCreateElement("div", [["class", "valueContainer"]], container)
        
        const leftArrow = myCreateElement("div", [["class", "arrow"]], valueContainer);
        addIcon(leftArrow, "fa-solid fa-angle-left")
        leftArrow.addEventListener("click", () => {this.moveOption(-1)});

        this.value = myCreateElement("div", [["class", "value"]], valueContainer);
        this.value.innerText = valuesArray[this.actualPosition];
        
        const rightArrow = myCreateElement("div", [["class", "arrow"]], valueContainer);
        addIcon(rightArrow, "fa-solid fa-angle-right")
        rightArrow.addEventListener("click", () => {this.moveOption(1)});

        
    }
    
    moveOption = (index) => {
        this.actualPosition += index;
        
        if (!this.values || this.values.length === 0) return;

        if (this.actualPosition <= -1) 
            this.actualPosition = this.values.length-1;
        if (this.actualPosition >= this.values.length) 
            this.actualPosition = 0;
        
        this.value.innerText = this.values[this.actualPosition];
        this.f(this.actualPosition);
    }

}

export const generateLineSquareNodes = (j, size, game, strI=0, dir=1) => {
    VerticalSpaceLeft(size-j, game);
    for (let i = 0; i < 2; i++) {
        myCreateElement("div", [["class", "cell empty"], ["id", `${size-j}-${strI+(i*dir)}`]], game);
        for (let ruleSpaces = (2*j)-1; ruleSpaces > 0; ruleSpaces--) {
            myCreateElement("div", [["class", "hrule"]], game)
        }
    }
    myCreateElement("div", [["class", "cell empty"], ["id", `${size-j}-${strI+(2*dir)}`]], game);
    VerticalSpaceRight(size-j, game);
}

export const generateLineSquareVertical = (j, size, game) => {
    VerticalSpaceLeft(size-j, game);
    for (let i = 2; i > 0; i--) {
        if (j == 1 && i == 1) myCreateElement("div", [["class", "emptySpace"]], game);
        else myCreateElement("div", [["class", "vrule"]], game);
        for (let ruleSpaces = (2*j)-1; ruleSpaces > 0; ruleSpaces--) {
            myCreateElement("div", [["class", "emptySpace"]], game);
        }
    }
    myCreateElement("div", [["class", "vrule"]], game);
    VerticalSpaceRight(size-j, game);
}

export const VerticalSpaceLeft = (size, game) => {
    for (let i = size; i > 0; i--) {
        myCreateElement("div", [["class", "vrule"]], game)
        myCreateElement("div", [["class", "emptySpace"]], game)
    }
}

export const VerticalSpaceRight = (size, game) => {
    for (let i = size; i > 0; i--) {
        myCreateElement("div", [["class", "emptySpace"]], game)
        myCreateElement("div", [["class", "vrule"]], game)
    }
}

export const generateBoard = (size, game) => {
    for (let j = size; j > 0; j--) {
        generateLineSquareNodes(j, size, game);
        generateLineSquareVertical(j, size, game);
    }

    for (let j = size-1; j > 0; j--) {
        myCreateElement("div", [["class", "cell empty"], ["id", `${size-j-1}-${7}`]], game);
        myCreateElement("div", [["class", "hrule"]], game)
    }
    myCreateElement("div", [["class", "cell empty"], ["id", `${size-1}-${7}`]], game);
    
    for (let i = 3; i > 0; i--) myCreateElement("div", [["class", "emptySpace"]], game);

    myCreateElement("div", [["class", "cell empty"], ["id", `${size-1}-${3}`]], game);
    for (let j = size-1; j > 0; j--) {
        myCreateElement("div", [["class", "hrule"]], game)
        myCreateElement("div", [["class", "cell empty"], ["id", `${size-j-1}-${3}`]], game);
    }
    
    for (let j = 1; j <= size; j++) {
        generateLineSquareVertical(j, size, game);
        generateLineSquareNodes(j, size, game, 6, -1);
    }
}