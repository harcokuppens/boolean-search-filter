import { CharStream, CommonTokenStream } from 'antlr4';
import LabeledExprLexer from './generated/LabeledExprLexer.js';
import LabeledExprParser from './generated/LabeledExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';

const input = "3+4\n5+6\na=4\na\n"

function simpleEval(input: string): number {
    //const input = "your text to parse here"
    const chars = new CharStream(input); // replace this with a FileStream as required
    const lexer = new LabeledExprLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new LabeledExprParser(tokens);
    const tree = parser.prog();
    console.log(tree.toStringTree(null, parser));

    const xeval = new EvalVisitor();
    const value = xeval.visit(tree);
    return value;
}

simpleEval(input)


var is_browser = typeof window !== 'undefined';

console.log(is_browser)

console.log("finished");
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
                    let value = simpleEval(searchvalue);
                    answer.textContent = value.toString();
                    // logfilter(searchvalues);
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
}
