

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



function matchBooleanExpression(simpleBooleanExpr: ExprContext, line: string): boolean {
    const evalVisitor = new EvalVisitor(line);
    const foundMatch = evalVisitor.visit(simpleBooleanExpr);
    // if (foundMatch) {
    //     const words = xeval.getStringValues();
    //     console.log("words used in match: " + words.toString());
    // }
    return foundMatch;
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
                    const searchvalue = searchbox.value + "\n";
                    // let value = simpleEval(searchvalue);
                    // answer.textContent = value.toString();
                    searchFilter(searchvalue);
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


    function processSibling(sibling: Element, booleanExpr: ExprContext, highlightValues: Array<string>): boolean {

        // get nested li elements in sibbling (eg. in ol list)
        let foundAtLeastOneMatch: boolean = false;
        const liElements = sibling.querySelectorAll<HTMLLIElement>("li");
        liElements.forEach((li, index) => {

            // check boolean expression matches
            let foundMatch = false;
            if (li.textContent) foundMatch = matchBooleanExpression(booleanExpr, li.textContent);

            // hide none matched items
            if (foundMatch) {
                foundAtLeastOneMatch = true;
                li.style.display = ""; // Show the <li> element
            } else {
                li.style.display = "none"; // Hide the <li> element
            }

            // in a match highlight all words in boolean expression
            if (foundMatch && highlightValues) {

                // Unwrap any <mark> elements inside the list item from previous search
                li.querySelectorAll("mark").forEach((mark) => {
                    const parent = mark.parentNode!;
                    while (mark.firstChild) {
                        parent.insertBefore(mark.firstChild, mark);
                    }
                    parent.removeChild(mark);
                });

                // Highlight each search term in the list item
                for (const value of highlightValues) {
                    //const regex = new RegExp(`(${value})(?=[^<]*<)`, "gi");
                    const regex = new RegExp(`(${value})`, "gi");
                    li.innerHTML = li.innerHTML.replace(regex, "<mark>$1</mark>");
                }
            }

        });
        return foundAtLeastOneMatch;
    }

    function getHighlightValues(booleanExpr: string): Array<string> {
        const tree = getParserTree(booleanExpr);
        const xeval = new WordsVisitor();
        xeval.visit(tree);
        const highlightValues = xeval.getStringValues();
        //console.log("words in expression: " + highlightValues.toString());
        return highlightValues;
    }


    function searchFilter(booleanExpr: string) {

        // parse boolean expression as string to parse tree
        const tree = getParserTree(booleanExpr);
        // get all strings from boolean expression to highlight them in a match
        const highlightValues = getHighlightValues(booleanExpr);

        // Select all <h1> elements inside the element with ID 'wikitext'
        const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#wikitext > h1");
        h1Elements.forEach((h1, index) => {
            let foundAtLeastOneMatch = false;

            // Get all elements between this <h1> and the next <h1>
            let sibling = h1.nextElementSibling;
            while (sibling && sibling.tagName !== "H1") {
                let foundMatch: boolean = processSibling(sibling, tree, highlightValues);
                if (foundMatch) {
                    foundAtLeastOneMatch = true;
                }
                sibling = sibling.nextElementSibling;
            };

            // Show or hide the <h1> based on whether any list items were shown
            if (foundAtLeastOneMatch) {
                h1.style.display = "";
            } else {
                h1.style.display = "none";
            }
        });
    }
}

