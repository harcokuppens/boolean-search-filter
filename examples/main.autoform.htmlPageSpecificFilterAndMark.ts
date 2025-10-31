import { BooleanSearch } from '../src/BooleanSearch.ts';

// autoform
const customId = "BooleanSearch";
new BooleanSearch().setId(customId)
    .setAutoForm()
    .setHtmlPageSpecificFilterAndMarkCallback(htmlPageSpecificFilterAndMark)
    .apply();


/** custom function which only searches,filters and marks for highlighting year 2022 and 2024  **/
function htmlPageSpecificFilterAndMark(filterAndMarkElements: BooleanSearch.filterAndMarkElementsFunc): boolean {

    let anyMatchFound = false;
    // Select all <h1> elements inside the element with ID 'wikitext'
    const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#mycontent > h1");
    h1Elements.forEach((h1, index) => {
        let foundAtLeastOneMatch = false;

        // only  2024 and 2022
        if (h1.textContent == "2024" || h1.textContent == "2022") {

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
        }
    });
    return anyMatchFound;
}


