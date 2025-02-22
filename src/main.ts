

import { CharStream, CommonTokenStream } from 'antlr4';
import BooleanExprLexer from './generated/BooleanExprLexer.js';
import BooleanExprParser, { ExprContext } from './generated/BooleanExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';
import { WordsVisitor } from './WordsVisitor.js';

// // method to log tokens, for debugging grammar
// function logTokens(symbols: (string | null)[], tokenStream: CommonTokenStream) {
//     tokenStream.fill();
//     tokenStream.tokens.forEach((token) => {
//         const tokenName = symbols[token.type] || token.type;
//         console.log(`Type: ${token.type}, Name: ${tokenName}, Text: '${token.text}'`);
//     });
// }


// boolexpr=booleanexpression.compile(booleanExpression: string)
function getParserTree(booleanExpression: string): ExprContext {
    const chars = new CharStream(booleanExpression); // replace this with a FileStream as required
    const lexer = new BooleanExprLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    //logTokens(lexer.symbolicNames, tokens);
    const parser = new BooleanExprParser(tokens);
    let tree = parser.expr();

    // Check for errors, and if so throw exception to be handled higher up
    if (parser.syntaxErrorsCount > 0) {
        //console.error('Parsing error occurred.');
        throw new SyntaxError
    }
    //console.log(tree.toStringTree(null, parser));
    return tree;
}

// boolexpr.match
function matchBooleanExpr(booleanExpr: ExprContext, line: string): boolean {
    const evalVisitor = new EvalVisitor(line);
    const foundMatch = evalVisitor.visit(booleanExpr);
    // if (foundMatch) {
    //     const words = evalVisitor.getStringValues();
    //     console.log("words used in match: " + words.toString());
    // }
    return foundMatch;
}

// boolexpr.getWords
function getWordsInBooleanExpr(booleanExpr: ExprContext): Array<string> {
    const wordsVisitor = new WordsVisitor();
    wordsVisitor.visit(booleanExpr);
    const words = wordsVisitor.getStringValues();
    return words;
}


var is_browser = typeof window !== 'undefined';

//----------------------------------------------------------------------------------------
//       node.js only code
//----------------------------------------------------------------------------------------

if (!is_browser) {
    const simpleBooleanExpr = "(kuppens AND vaAn) or aarts";
    const line = "paper by vaandrager adn harco kuppens ";

    const tree = getParserTree(simpleBooleanExpr);

    const foundMatch = matchBooleanExpr(tree, line)

    // const evalVisitor = new EvalVisitor(line);
    // const foundMatch = evalVisitor.visit(tree);
    // const values = evalVisitor.getStringValues();

    console.log("foundMatch: " + foundMatch.toString());
    //console.log("words used in match: " + values.toString());


    // const wordsVisitor = new WordsVisitor();
    // wordsVisitor.visit(tree);
    // const words = wordsVisitor.getStringValues();

    const words = getWordsInBooleanExpr(tree);
    console.log("words in expression: " + words.toString());
}

//----------------------------------------------------------------------------------------
//       browser only code
//----------------------------------------------------------------------------------------

if (is_browser) {
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

    function markText(rootNode: HTMLElement, word: string) {
        // word can also be empty string "" which we do not mark!
        if (word == "") return;
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null);
        let node;
        while (node = walker.nextNode()) {
            const parentNode = node.parentNode!;
            const regex = new RegExp(`(${word})`, 'gi');
            if (node.nodeValue && regex.test(node.nodeValue)) {
                // create new html text from text in textnode 
                const newHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
                // place this text in a div element as innerHTML making the text being parsed as html!
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHTML;
                // take the newly html nodes inside the div (tempDiv.firstChild) and place it in parentnode
                //  as child before node (we are changing), then remove this old node from parent. (only remaining the newly html nodes in the parent node) 
                while (tempDiv.firstChild) {
                    parentNode.insertBefore(tempDiv.firstChild, node);
                }
                parentNode.removeChild(node);
            }
        }
    }

    function unMarkText(rootNode: HTMLElement) {
        // Unwrap any <mark> elements inside the item from previous search
        rootNode.querySelectorAll("mark").forEach((mark) => {
            const parent = mark.parentNode!;
            while (mark.firstChild) {
                parent.insertBefore(mark.firstChild, mark);
                // bla <mark>textinside</mark>  --> bla textinside<mark>textinside</mark>
            }
            parent.removeChild(mark);
            // bla textinside<mark>textinside</mark> -> bla textinside
            parent.normalize(); // after removing mark tags we get multiple adjacent text nodes, with normalized they get merged into one
            // without normalizing a split text could not be matched by a next search anymore
        });
    }


    function filterAndMarkElements(elements: NodeListOf<HTMLElement>, booleanExpr: ExprContext, highlightValues: Array<string>): boolean {

        let foundAtLeastOneMatch: boolean = false;
        elements.forEach((itemElement, index) => {

            // check boolean expression matches
            let foundMatch = false;
            if (itemElement.textContent) foundMatch = matchBooleanExpr(booleanExpr, itemElement.textContent);

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


    let elementsCssSelector = "li";

    type filterAndMarkElementsFunc = (nodes: NodeListOf<HTMLElement>) => boolean;
    // type customPageCallback = (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean;
    // type customPageCallback = (fn: filterAndMarkElementsFunc) => boolean;

    //let htmlPageSpecificFilterAndMarkCallback: (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean;
    let htmlPageSpecificFilterAndMarkCallback: (fn: filterAndMarkElementsFunc) => boolean;

    // Ensure it's initialized to a default function to prevent undefined access.
    //htmlPageSpecificFilterAndMarkCallback = () => { throw new Error("setFilterAndMark must be called first"); };


    htmlPageSpecificFilterAndMarkCallback = filterAndMarkElements => {
        const elements = document.querySelectorAll<HTMLElement>("li");
        let foundMatch: boolean = filterAndMarkElements(elements);
        return foundMatch;
    };


    //function setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: filterAndMarkElementsFunc) => boolean) {

    function setElementsCssSelector(elementsCssSelector: string) {
        elementsCssSelector = elementsCssSelector;
    }

    function setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: (nodes: NodeListOf<HTMLElement>) => boolean) => boolean) {
        htmlPageSpecificFilterAndMarkCallback = callback;
    }


    function searchFilter(booleanExpr: string): boolean {

        // parse boolean expression as string to parse tree
        const tree = getParserTree(booleanExpr);

        // get all strings from boolean expression to highlight them in a match
        const highlightValues = getWordsInBooleanExpr(tree);
        //console.log("words in expression: " + highlightValues.toString());

        let filterAndMarkElementsFn = (elements: NodeListOf<HTMLElement>) => filterAndMarkElements(elements, tree, highlightValues);
        // const anyMatchFound = htmlPageSpecificFilterAndMark(filterAndMarkElements);
        const anyMatchFound = htmlPageSpecificFilterAndMarkCallback(filterAndMarkElementsFn);
        return anyMatchFound;
    }



    //  apply page specific filtering and marking
    //----------------------------------------------------------------------------------------


    setHtmlPageSpecificFilterAndMarkCallback(htmlPageSpecificFilterAndMark);

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
}

