

import { CharStream, CommonTokenStream } from 'antlr4';
import BooleanExprLexer from './generated/BooleanExprLexer.js';
import BooleanExprParser, { ExprContext } from './generated/BooleanExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';
import { WordsVisitor } from './WordsVisitor.js';


function getParserTree(booleanExpression: string): ExprContext {
    //const input = "your text to parse here"
    const chars = new CharStream(booleanExpression); // replace this with a FileStream as required
    const lexer = new BooleanExprLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new BooleanExprParser(tokens);
    const tree = parser.expr();
    console.log(tree.toStringTree(null, parser));
    return tree;
}

function matchSimpleBooleanExpressionWithValues(simpleBooleanExpr: ExprContext, line: string): [boolean, string[]] {
    const xeval = new EvalVisitor(line);
    const foundMatch = xeval.visit(simpleBooleanExpr);
    const values = xeval.getStringValues();
    return [foundMatch, values];
}

function matchSimpleBooleanExpression(simpleBooleanExpr: ExprContext, line: string): boolean {
    const xeval = new EvalVisitor(line);
    const foundMatch = xeval.visit(simpleBooleanExpr);
    //const values = xeval.getStringValues();
    if (foundMatch) {
        const words = xeval.getStringValues();
        console.log("words used in match: " + words.toString());
    }
    return foundMatch;
}

function simpleEval(booleanExpression: string, line: string): [boolean, string[]] {
    //const input = "your text to parse here"
    // const chars = new CharStream(booleanExpression); // replace this with a FileStream as required
    // const lexer = new BooleanExprLexer(chars);
    // const tokens = new CommonTokenStream(lexer);
    // const parser = new BooleanExprParser(tokens);
    // const tree = parser.expr();
    // console.log(tree.toStringTree(null, parser));

    const tree = getParserTree(booleanExpression);

    // const xeval = new EvalVisitor(line);
    // const value = xeval.visit(tree);
    // return value;
    return matchSimpleBooleanExpressionWithValues(tree, line);
}



//let simpleBooleanExpr = "kuppens  vaAn"
let simpleBooleanExpr = "(kuppens AND vaAn) or aarts"
//let simpleBooleanExpr = "kupens or vaAn"
let [foundMatch, values] = simpleEval(simpleBooleanExpr, "paper by vaandrager adn harco kuppens ");
//foundMatch = simpleEval(simpleBooleanExpr, "paper by vaandrager adn harco kuppens ");
//values = getHighlightValues(simpleBooleanExpr);


console.log("foundMatch: " + foundMatch.toString());
console.log("words used in match: " + values.toString());

const tree = getParserTree(simpleBooleanExpr);
const xeval = new WordsVisitor();
xeval.visit(tree);
const words = xeval.getStringValues();
console.log("words in expression: " + words.toString());

var is_browser = typeof window !== 'undefined';

//console.log(is_browser)
//console.log("finished");

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
                    logfilter(searchvalue);
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


    function processSibling(sibling: Element, simpleBooleanExpr: ExprContext, highlightValues: Array<string>): boolean {

        // console.log("  Examining sibling:", sibling);

        // get nested li elements in sibbling (eg. in ol list)
        let foundAtLeastOneMatch: boolean = false;
        const liElements = sibling.querySelectorAll<HTMLLIElement>("li");
        liElements.forEach((li, index) => {

            //  console.log("    Found <li>: ", li.textContent?.trim());
            let foundMatch = false;
            if (li.textContent) foundMatch = matchSimpleBooleanExpression(simpleBooleanExpr, li.textContent);

            if (foundMatch && highlightValues) {
                // console.log("    Showing <li> and highlighting matches...");
                foundAtLeastOneMatch = true;

                // Unwrap any <mark> elements inside the list item
                li.querySelectorAll("mark").forEach((mark) => {
                    // console.log("    Removing <mark> from <li>...");
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
                li.style.display = ""; // Show the <li> element
            } else {
                // console.log("    Hiding <li>...");
                li.style.display = "none"; // Hide the <li> element
            }

        });
        return foundAtLeastOneMatch;

    }



    function logfilter(simpleBooleanExpr: string) {
        console.log("Starting filter function...");
        console.log("Input simpleBooleanExpr:", simpleBooleanExpr);

        const tree = getParserTree(simpleBooleanExpr);
        // const highlightValues: Array<string> = getHighlightValues(simpleBooleanExpr);
        // const tree = getParserTree(simpleBooleanExpr);
        const xeval = new WordsVisitor();
        xeval.visit(tree);
        const highlightValues = xeval.getStringValues();
        console.log("words in expression: " + highlightValues.toString());

        // Select all <h1> elements inside the element with ID 'wikitext'
        const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#wikitext > h1");
        //console.log("Found <h1> elements:", h1Elements);

        h1Elements.forEach((h1, index) => {
            // console.log(`Processing <h1> element #${index + 1}:`, h1.textContent?.trim());
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
                //  console.log(`  Showing <h1> since at least one <li> was shown: "${h1.textContent?.trim()}"`);
                h1.style.display = "";
            } else {
                //  console.log(`  Hiding <h1> since no matching <li> was found: "${h1.textContent?.trim()}"`);
                h1.style.display = "none";
            }
        });

        console.log("Filter function completed.");
    }



    // Attach it to global scope (optional, if you want to access it in the debugger)
    (window as any).logfilter = logfilter;


}

