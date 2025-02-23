import { setElementsCssSelector, setHtmlPageSpecificFilterAndMarkCallback, filterAndMarkElementsFunc } from './booleansearch.js';

// kiss:  BooleanSearch  class

// create 'register' method to do event registration in html document with addEventListener
// add function to generate html form within a div
// add function to add custom html form within a div

// add function to turn on/off case sensitivity


//  apply page specific filtering and marking
//----------------------------------------------------------------------------------------

setElementsCssSelector("li");
//setElementsCssSelector("h1");
//setHtmlPageSpecificFilterAndMarkCallback(htmlPageSpecificFilterAndMark);

function htmlPageSpecificFilterAndMark(filterAndMarkElements: filterAndMarkElementsFunc): boolean {

    //function htmlPageSpecificFilterAndMark(filterAndMarkElements: (elements: NodeListOf<HTMLElement>) => boolean): boolean {

    let anyMatchFound = false;
    // Select all <h1> elements inside the element with ID 'wikitext'
    const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#wikitext > h1");
    h1Elements.forEach((h1, index) => {
        let foundAtLeastOneMatch = false;

        // process all sibling elements between this <h1> and the next <h1>
        let sibling = h1.nextElementSibling;
        while (sibling && sibling.tagName !== "H1") {
            // get nested li elements in sibbling (eg. in ol list)
            const elements = sibling.querySelectorAll<HTMLElement>("li");
            let foundMatch: boolean = filterAndMarkElements(elements);
            if (foundMatch) {
                foundAtLeastOneMatch = true;
            }
            sibling = sibling.nextElementSibling;
        };

        // Show or hide the <h1> based on whether any list items were shown
        if (foundAtLeastOneMatch) {
            h1.style.display = "";
            anyMatchFound = true;
        } else {
            h1.style.display = "none";
        }
    });
    return anyMatchFound;
}


