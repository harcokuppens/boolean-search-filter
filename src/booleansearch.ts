import BooleanExpression from './booleanexpression.js';
import { markText, unMarkText } from './markHtmlElements.js';
let elementsCssSelectorForItems = "li";

export type filterAndMarkElementsFunc = (nodes: NodeListOf<HTMLElement>) => boolean;
// type customPageCallback = (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean;
// type customPageCallback = (fn: filterAndMarkElementsFunc) => boolean;

//let htmlPageSpecificFilterAndMarkCallback: (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean;
let htmlPageSpecificFilterAndMarkCallback: (fn: filterAndMarkElementsFunc) => boolean;

// Ensure it's initialized to a default function to prevent undefined access.
//htmlPageSpecificFilterAndMarkCallback = () => { throw new Error("setFilterAndMark must be called first"); };

function defaultPageFilterAndMarkCallback(filterAndMarkElements: filterAndMarkElementsFunc) {
    console.log("elementsCssSelector:" + elementsCssSelectorForItems);
    const elements = document.querySelectorAll<HTMLElement>(elementsCssSelectorForItems);
    let foundMatch: boolean = filterAndMarkElements(elements);
    return foundMatch;
};

htmlPageSpecificFilterAndMarkCallback = defaultPageFilterAndMarkCallback;


//function setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: filterAndMarkElementsFunc) => boolean) {

export function setElementsCssSelector(elementsCssSelector: string) {
    elementsCssSelectorForItems = elementsCssSelector;
}

export function setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean) {
    htmlPageSpecificFilterAndMarkCallback = callback;
}



document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('button');
    const searchbox = document.getElementById('searchbox') as HTMLInputElement;
    const form = document.getElementById('searchForm') as HTMLFormElement;
    const answer = document.getElementById('answer') as HTMLElement;
    const error = document.getElementById('error') as HTMLElement;


    if (button) {
        button.addEventListener('click', function () {
            if (searchbox) {
                const searchvalue = searchbox.value;

                try {
                    answer.textContent = "";
                    error.textContent = "";
                    const match = searchFilter(searchvalue);
                    if (!match) {
                        answer.textContent = "No matches";
                    }
                } catch (exception) {
                    error.textContent = "Error in boolean search term";
                    // search with a never matching string to hide all listed entries so that focus comes on error
                    searchFilter('fsdjfkjaskfjksdjfksdjflksdjlka');
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




function filterAndMarkElements(elements: NodeListOf<HTMLElement>, booleanExpr: BooleanExpression): boolean {

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

        // in a match highlight all words in boolean expression
        if (foundMatch && highlightValues) {
            // remove mark tags within itemElement
            unMarkText(itemElement);

            // Highlight each search term in the item
            for (const value of highlightValues) {
                markText(itemElement, value);
            }
        }

    });
    return foundAtLeastOneMatch;
}





function searchFilter(booleanExpr: string): boolean {

    // parse boolean expression as string to parse tree
    const boolExpr = new BooleanExpression(booleanExpr);

    // get all strings from boolean expression to highlight them in a match
    //   const highlightValues = boolExpr.getWordsInBooleanExpr(tree);
    //console.log("words in expression: " + highlightValues.toString());

    let filterAndMarkElementsFn = (elements: NodeListOf<HTMLElement>) => filterAndMarkElements(elements, boolExpr);
    // const anyMatchFound = htmlPageSpecificFilterAndMark(filterAndMarkElements);
    const anyMatchFound = htmlPageSpecificFilterAndMarkCallback(filterAndMarkElementsFn);
    return anyMatchFound;
}

