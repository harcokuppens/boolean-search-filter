import { BooleanSearch } from '../src/BooleanSearch.js';


//  apply page specific filtering and marking
//----------------------------------------------------------------------------------------

// let booleansearch = new BooleanSearch();
// booleansearch.setElementsCssSelector("li");
// booleansearch.setSectionElementsCssSelector("#wikitext > h1");
// booleansearch.apply();


const customId = "Bla";
const formString: string = `
<b> customform </b>
<form id="${customId}_searchForm">
    <input id="${customId}_searchbox" type="text" aria-label="Search text" />
    <button id="${customId}_button" type="button" aria-label="Do Search">
    Search
    </button>
</form>
<div id="${customId}_error" style="color: red; font-weight: bold"></div>
<div id="${customId}_answer"></div>
`;

//new BooleanSearch().setSectionElementsCssSelector("#wikitext > h1").setElementsCssSelector("li").setHighlighting(false).apply();
//new BooleanSearch().setSectionElementsCssSelector("#wikitext > h1").setElementsCssSelector("li").setId(customId).setForm(formString).apply();
//new BooleanSearch().setSectionElementsCssSelector("#wikitext > h1").setElementsCssSelector("li").setForm(formString).setId(customId).apply();
//new BooleanSearch().setSectionElementsCssSelector("#wikitext > h1").setElementsCssSelector("li").setId(customId).setAutoForm().apply();
new BooleanSearch().setSectionElementsCssSelector("#wikitext > h1").setElementsCssSelector("li").setAutoForm().apply();

//new BooleanSearch().setHtmlPageSpecificFilterAndMarkCallback(htmlPageSpecificFilterAndMark).setHighlighting(true).apply();



function htmlPageSpecificFilterAndMark(filterAndMarkElements: BooleanSearch.filterAndMarkElementsFunc): boolean {

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


