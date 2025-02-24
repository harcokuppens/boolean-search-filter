import BooleanExpression from './BooleanExpression.js';
import { markText, unMarkText } from './highlightWords.js';

export namespace BooleanSearch {
    export type filterAndMarkElementsFunc = (nodes: NodeListOf<HTMLElement>) => boolean;
}

export class BooleanSearch {
    private htmlPageSpecificFilterAndMarkCallback: ((fn: BooleanSearch.filterAndMarkElementsFunc) => boolean) | null = null;
    private elementsCssSelectorForItems: string = "li";
    private elementsCssSelectorForSectionItems: string | null = null;
    private highlightingActive: boolean = true;

    private id = "BooleanSearch";

    setAutoForm(): this {
        const formString: string = `
        <b> autoform </b>
        <form id="${this.id}_searchForm">
            <input id="${this.id}_searchbox" type="text" aria-label="Search text" />
            <button id="${this.id}_button" type="button" aria-label="Do Search">
            Search
            </button>
        </form>
        <div id="${this.id}_error" style="color: red; font-weight: bold"></div>
        <div id="${this.id}_answer"></div>
        `;
        document.getElementById(this.id)!.innerHTML = formString;
        return this;
    }

    setForm(formString: string): this {
        document.getElementById(this.id)!.innerHTML = formString;
        return this;
    }

    setId(id: string): this {
        this.id = id;
        return this;
    };

    setElementsCssSelector(elementsCssSelector: string): this {
        this.elementsCssSelectorForItems = elementsCssSelector;
        return this;
    }

    setSectionElementsCssSelector(elementsCssSelector: string): this {
        this.elementsCssSelectorForSectionItems = elementsCssSelector;
        return this;
    }

    setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: BooleanSearch.filterAndMarkElementsFunc) => boolean): this {
        this.htmlPageSpecificFilterAndMarkCallback = callback;
        return this;
    }

    setHighlighting(active: boolean): this {
        this.highlightingActive = active;
        return this;
    }

    apply(): void {
        if (this.htmlPageSpecificFilterAndMarkCallback === null) {
            if (this.elementsCssSelectorForSectionItems === null) {
                this.htmlPageSpecificFilterAndMarkCallback = this.elementsPageFilterAndMarkCallback;
            } else {
                this.htmlPageSpecificFilterAndMarkCallback = this.sectionedElementsPageFilterAndMarkCallback;
            }
        }

        let booleansearch = this;

        document.addEventListener('DOMContentLoaded', function () {
            const button = document.getElementById(`${booleansearch.id}_button`);
            const searchbox = document.getElementById(`${booleansearch.id}_searchbox`) as HTMLInputElement;
            const form = document.getElementById(`${booleansearch.id}_searchForm`) as HTMLFormElement;
            const answer = document.getElementById(`${booleansearch.id}_answer`) as HTMLElement;
            const error = document.getElementById(`${booleansearch.id}_error`) as HTMLElement;


            if (button) {
                button.addEventListener('click', function () {
                    if (searchbox) {
                        const searchvalue = searchbox.value;

                        try {
                            answer.textContent = "";
                            error.textContent = "";
                            const match = booleansearch.searchFilter(searchvalue);
                            if (!match) {
                                answer.textContent = "No matches";
                            }
                        } catch (exception) {
                            error.textContent = "Error in boolean search term";
                            // search with a never matching string to hide all listed entries so that focus comes on error
                            booleansearch.searchFilter('fsdjfkjaskfjksdjfksdjflksdjlka');
                        }
                    }
                });
            }

            if (searchbox && button) {
                searchbox.addEventListener('keyup', function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        button.click();
                        searchbox.blur(); // makes popup selectbox dissapear
                        searchbox.focus(); // sets focus back so that you can continue typing if wanted
                    }
                });
            }
            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault(); // Prevent form submission
                });
            }
        });


    }

    private searchFilter(booleanExpr: string): boolean {

        // parse boolean expression as string to parse tree
        const boolExpr = new BooleanExpression(booleanExpr);

        // get all strings from boolean expression to highlight them in a match
        //   const highlightValues = boolExpr.getWordsInBooleanExpr(tree);
        //console.log("words in expression: " + highlightValues.toString());

        let filterAndMarkElementsFn = (elements: NodeListOf<HTMLElement>) => this.filterAndMarkElementsMatchingBooleanExpression(elements, boolExpr);
        // const anyMatchFound = htmlPageSpecificFilterAndMark(filterAndMarkElements);
        const anyMatchFound = this.htmlPageSpecificFilterAndMarkCallback!(filterAndMarkElementsFn);
        return anyMatchFound;
    }

    private elementsPageFilterAndMarkCallback(filterAndMarkElements: BooleanSearch.filterAndMarkElementsFunc) {
        //console.log("elementsCssSelector:" + this.elementsCssSelectorForItems);
        const elements = document.querySelectorAll<HTMLElement>(this.elementsCssSelectorForItems);
        let foundMatch: boolean = filterAndMarkElements(elements);
        return foundMatch;
    };

    private sectionedElementsPageFilterAndMarkCallback(filterAndMarkElements: BooleanSearch.filterAndMarkElementsFunc): boolean {

        let anyMatchFound = false;
        // Select all <sectionElement> elements inside the element with ID 'wikitext'
        // only if elementsCssSelectorForSectionItems is not null is this method used!
        const sectionElements = document.querySelectorAll<HTMLHeadingElement>(this.elementsCssSelectorForSectionItems!);
        sectionElements.forEach((sectionElement, index) => {
            let foundAtLeastOneMatch = false;
            let sectionTagname = sectionElement.tagName;
            // process all sibling elements between this <sectionElement> and the next <sectionElement>
            let sibling = sectionElement.nextElementSibling;
            while (sibling && sibling.tagName !== sectionTagname) {
                // get nested li elements in sibbling (eg. in ol list)
                const elements = sibling.querySelectorAll<HTMLElement>(this.elementsCssSelectorForItems);
                let foundMatch: boolean = filterAndMarkElements(elements);
                if (foundMatch) {
                    foundAtLeastOneMatch = true;
                }
                sibling = sibling.nextElementSibling;
            };

            // Show or hide the <sectionElement> based on whether any list items were shown
            if (foundAtLeastOneMatch) {
                sectionElement.style.display = "";
                anyMatchFound = true;
            } else {
                sectionElement.style.display = "none";
            }
        });
        return anyMatchFound;
    }

    private filterAndMarkElementsMatchingBooleanExpression(elements: NodeListOf<HTMLElement>, booleanExpr: BooleanExpression): boolean {

        let highlightValues: Array<string> = booleanExpr.getWords();

        let foundAtLeastOneMatch: boolean = false;
        elements.forEach((itemElement, index) => {

            // check boolean expression matches
            let foundMatch = false;
            if (itemElement.textContent) foundMatch = booleanExpr.match(itemElement.textContent);

            // hide none matched items
            if (foundMatch) {
                foundAtLeastOneMatch = true;
                itemElement.style.display = ""; // Show the item element
            } else {
                itemElement.style.display = "none"; // Hide the item element
            }

            if (this.highlightingActive) {
                // in a match highlight all words in boolean expression
                if (foundMatch && highlightValues) {
                    // remove mark tags within itemElement
                    unMarkText(itemElement);

                    // Highlight each search term in the item
                    for (const value of highlightValues) {
                        markText(itemElement, value);
                    }
                }
            }

        });
        return foundAtLeastOneMatch;
    }

}
