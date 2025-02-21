

import { CharStream, CommonTokenStream } from 'antlr4';
import BooleanExprLexer from './generated/BooleanExprLexer.js';
import BooleanExprParser, { ExprContext } from './generated/BooleanExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';
import { WordsVisitor } from './WordsVisitor.js';


function getParserTree(booleanExpression: string): ExprContext {
    const chars = new CharStream(booleanExpression); // replace this with a FileStream as required
    const lexer = new BooleanExprLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new BooleanExprParser(tokens);
    const tree = parser.expr();
    //console.log(tree.toStringTree(null, parser));
    return tree;
}

function matchBooleanExpression(booleanExpr: ExprContext, line: string): boolean {
    if (booleanExpr.exception) {
        // we only get exception for whitespace string with our grammar,
        // but this means just always match!
        return true;
    }
    const evalVisitor = new EvalVisitor(line);
    const foundMatch = evalVisitor.visit(booleanExpr);
    // if (foundMatch) {
    //     const words = evalVisitor.getStringValues();
    //     console.log("words used in match: " + words.toString());
    // }
    return foundMatch;
}

function getWordsInBooleanExpr(booleanExpr: string): Array<string> {
    const tree = getParserTree(booleanExpr);
    if (tree.exception) {
        // we only get exception for whitespace string with our grammar,
        // but this means no words in expression!
        return [];
    }
    const xeval = new WordsVisitor();
    xeval.visit(tree);
    const words = xeval.getStringValues();
    return words;
}


var is_browser = typeof window !== 'undefined';

//----------------------------------------------------------------------------------------
//       node.js only code
//----------------------------------------------------------------------------------------

if (!is_browser) {
    const simpleBooleanExpr = "(kuppens AND vaAn) or aarts";
    const tree = getParserTree(simpleBooleanExpr);

    const line = "paper by vaandrager adn harco kuppens ";
    const evalVisitor = new EvalVisitor(line);
    const foundMatch = evalVisitor.visit(tree);
    const values = evalVisitor.getStringValues();

    console.log("foundMatch: " + foundMatch.toString());
    console.log("words used in match: " + values.toString());


    const wordsVisitor = new WordsVisitor();
    wordsVisitor.visit(tree);
    const words = wordsVisitor.getStringValues();
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


        if (button) {
            button.addEventListener('click', function () {
                if (searchbox) {
                    const searchvalue = searchbox.value;
                    const match = searchFilter(searchvalue);
                    if (match) {
                        answer.textContent = "";
                    } else {
                        answer.textContent = "No matches";
                    }
                }
            });
        }

        if (searchbox && button) {
            searchbox.addEventListener('keyup', function (event) {
                if (event.key === 'Enter') {
                    // event.preventDefault();
                    button.click();
                }
            });
        }
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent form submission
            });
        }
    });


    function filterAndMarkElements(elements: NodeListOf<HTMLElement>, booleanExpr: ExprContext, highlightValues: Array<string>): boolean {

        let foundAtLeastOneMatch: boolean = false;
        elements.forEach((itemElement, index) => {

            // check boolean expression matches
            let foundMatch = false;
            if (itemElement.textContent) foundMatch = matchBooleanExpression(booleanExpr, itemElement.textContent);

            // hide none matched items
            if (foundMatch) {
                foundAtLeastOneMatch = true;
                itemElement.style.display = ""; // Show the item element
            } else {
                itemElement.style.display = "none"; // Hide the item element
            }

            // in a match highlight all words in boolean expression
            if (foundMatch && highlightValues) {

                // Unwrap any <mark> elements inside the item from previous search
                itemElement.querySelectorAll("mark").forEach((mark) => {
                    const parent = mark.parentNode!;
                    while (mark.firstChild) {
                        parent.insertBefore(mark.firstChild, mark);
                    }
                    parent.removeChild(mark);
                });

                // Highlight each search term in the item
                for (const value of highlightValues) {
                    //const regex = new RegExp(`(${value})(?=[^<]*<)`, "gi");
                    const regex = new RegExp(`(${value})`, "gi");
                    itemElement.innerHTML = itemElement.innerHTML.replace(regex, "<mark>$1</mark>");
                }
            }

        });
        return foundAtLeastOneMatch;
    }

    function searchFilter(booleanExpr: string): boolean {

        // parse boolean expression as string to parse tree
        const tree = getParserTree(booleanExpr);
        // get all strings from boolean expression to highlight them in a match
        const highlightValues = getWordsInBooleanExpr(booleanExpr);
        //console.log("words in expression: " + highlightValues.toString());
        const anyMatchFound = htmlPageSpecificFilterAndMark(tree, highlightValues);
        return anyMatchFound;
    }

    function htmlPageSpecificFilterAndMark(booleanExpr: ExprContext, highlightValues: Array<string>): boolean {

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
                let foundMatch: boolean = filterAndMarkElements(elements, booleanExpr, highlightValues);
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

