import BooleanExpression from '@harcokuppens/boolean-expression';
import { markText, unMarkText } from '@harcokuppens/highlight-words';

export namespace BooleanSearchTypes {
    export type filterAndMarkElementsFunc = (nodes: NodeListOf<HTMLElement>) => boolean;
}

export class BooleanSearch {
    private htmlPageSpecificFilterAndMarkCallback: ((fn: BooleanSearchTypes.filterAndMarkElementsFunc) => boolean) | null = null;
    private elementsCssSelectorForItems: string = "li";
    private elementsCssSelectorForSectionItems: string | null = null;
    private highlightingActive: boolean = true;

    private id = "BooleanSearch";

    /**
     * Sets the auto-generated search form in the HTML element with the specified ID.
     * @returns {this} The current instance of BooleanSearch.
     */
    setAutoForm(): this {
        const formString: string = `
        
        <form id="${this.id}_searchForm">
            <input id="${this.id}_searchbox" type="text" aria-label="Type boolean search expression here..." style="width: 500px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; " />
            <button id="${this.id}_button" type="button" aria-label="Do Search">
            Search
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label>
            Case Sensitive <input type="checkbox" id="caseSensitiveCheckbox" onclick="toggleCaseSensitive()"> 
            </label>
            <br>
            <small> <b> &nbsp;&nbsp;&nbsp; <a href="https://www.npmjs.com/package/boolean-search-filter"> boolean search supported</a>: </b> eg. (John OR "Jane Smith") AND NOT journal </small>
        </form>
        <div id="${this.id}_error" style="color: red; font-weight: bold"></div>
        <div id="${this.id}_answer"></div>
        `;
        document.getElementById(this.id)!.innerHTML = formString;
        return this;
    }

    /*
        <input size="40"  id="wordInput" placeholder="Type words here..."></input>
        <button id="button" onclick="highlightWords()">Search</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          Case Sensitive <input type="checkbox" id="caseSensitiveCheckbox" onclick="toggleCaseSensitive()"> 
        </label>
    
    */

    /**
     * Sets a custom search form in the HTML element with the specified ID.
     * @param {string} formString - The HTML string for the custom search form.
     * @returns {this} The current instance of BooleanSearch.
     */
    setForm(formString: string): this {
        document.getElementById(this.id)!.innerHTML = formString;
        return this;
    }

    /**
     * Sets the ID of the HTML element where the search form will be inserted.
     * @param {string} id - The ID of the HTML element.
     * @returns {this} The current instance of BooleanSearch.
     */
    setId(id: string): this {
        this.id = id;
        return this;
    }

    /**
     * Sets the CSS selector for the elements to be searched.
     * @param {string} elementsCssSelector - The CSS selector for the elements.
     * @returns {this} The current instance of BooleanSearch.
     */
    setElementsCssSelector(elementsCssSelector: string): this {
        this.elementsCssSelectorForItems = elementsCssSelector;
        return this;
    }

    /**
     * Sets the CSS selector for the section elements to be searched.
     * @param {string} elementsCssSelector - The CSS selector for the section elements.
     * @returns {this} The current instance of BooleanSearch.
     */
    setSectionElementsCssSelector(elementsCssSelector: string): this {
        this.elementsCssSelectorForSectionItems = elementsCssSelector;
        return this;
    }

    /**
     * Sets a callback function for filtering and marking elements on the HTML page.
     * @param {(fn: BooleanSearch.filterAndMarkElementsFunc) => boolean} callback - The callback function.
     * @returns {this} The current instance of BooleanSearch.
     */
    setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: BooleanSearchTypes.filterAndMarkElementsFunc) => boolean): this {
        this.htmlPageSpecificFilterAndMarkCallback = callback;
        return this;
    }

    /**
     * Enables or disables highlighting of matched elements.
     * @param {boolean} active - Whether highlighting should be active.
     * @returns {this} The current instance of BooleanSearch.
     */
    setHighlighting(active: boolean): this {
        this.highlightingActive = active;
        return this;
    }

    /**
     * Applies the search functionality to the HTML page.
     */
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
            const checkbox = document.getElementById(`${booleansearch.id}_checkbox`) as HTMLInputElement;
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
                        searchbox.blur(); // makes popup selectbox disappear
                        searchbox.focus(); // sets focus back so that you can continue typing if wanted
                    }
                });
            }
            /*
                        if (checkbox && button) {
                            searchbox.addEventListener('keyup', function (event) {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    button.click();
                                    searchbox.blur(); // makes popup selectbox disappear
                                    searchbox.focus(); // sets focus back so that you can continue typing if wanted
                                }
                            });
                        }
                        window.caseSensitive = false;
                        window.toggleCaseSensitive = function () {
                            window.caseSensitive = !window.caseSensitive;
                            button.click();
                        };
                        */

            if (form) {
                form.addEventListener('submit', function (event) {
                    event.preventDefault(); // Prevent form submission
                });
            }
        });
    }

    /**
     * Filters and marks elements based on the provided boolean expression.
     * @param {string} booleanExpr - The boolean expression to filter elements.
     * @returns {boolean} Whether any elements matched the boolean expression.
     */
    private searchFilter(booleanExpr: string): boolean {
        const boolExpr = new BooleanExpression(booleanExpr);
        let filterAndMarkElementsFn = (elements: NodeListOf<HTMLElement>) => this.filterAndMarkElementsMatchingBooleanExpression(elements, boolExpr);
        const anyMatchFound = this.htmlPageSpecificFilterAndMarkCallback!(filterAndMarkElementsFn);
        return anyMatchFound;
    }

    /**
     * Filters and marks elements on the page based on the provided callback function.
     * @param {BooleanSearch.filterAndMarkElementsFunc} filterAndMarkElements - The callback function to filter and mark elements.
     * @returns {boolean} Whether any elements matched the boolean expression.
     */
    private elementsPageFilterAndMarkCallback(filterAndMarkElements: BooleanSearchTypes.filterAndMarkElementsFunc): boolean {
        const elements = document.querySelectorAll<HTMLElement>(this.elementsCssSelectorForItems);
        let foundMatch: boolean = filterAndMarkElements(elements);
        return foundMatch;
    }

    /**
     * Filters and marks sectioned elements on the page based on the provided callback function.
     * @param {BooleanSearch.filterAndMarkElementsFunc} filterAndMarkElements - The callback function to filter and mark elements.
     * @returns {boolean} Whether any elements matched the boolean expression.
     */
    private sectionedElementsPageFilterAndMarkCallback(filterAndMarkElements: BooleanSearchTypes.filterAndMarkElementsFunc): boolean {
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
            }

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

    /**
     * Filters and marks elements that match the provided boolean expression.
     * @param {NodeListOf<HTMLElement>} elements - The elements to filter and mark.
     * @param {BooleanExpression} booleanExpr - The boolean expression to match elements against.
     * @returns {boolean} Whether any elements matched the boolean expression.
     */
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
                itemElement.style.display = "none";  // Hide the item element
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
