export const myAppendChild = (appendTo, element) => {
    if (appendTo !== null) {
        if (appendTo === "body")
            document.body.appendChild(element);
        else if (appendTo instanceof HTMLElement)
            appendTo.appendChild(element);

    }
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
            this.actualPosition = this.valuesArray.length-1;
        if (this.actualPosition >= this.valuesArray.length) 
            this.actualPosition = 0;
        
        this.value.innerText = this.valuesArray[this.actualPosition];
        this.f(this.actualPosition);
    }

}