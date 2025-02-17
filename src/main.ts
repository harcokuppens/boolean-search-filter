import { CharStream, CommonTokenStream } from 'antlr4';
import LabeledExprLexer from './generated/LabeledExprLexer.js';
import LabeledExprParser from './generated/LabeledExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';

const input = "3+4\n5+6\na=4\na\n"
//const input = "your text to parse here"
const chars = new CharStream(input); // replace this with a FileStream as required
const lexer = new LabeledExprLexer(chars);
const tokens = new CommonTokenStream(lexer);
const parser = new LabeledExprParser(tokens);
const tree = parser.prog();

console.log(tree.toStringTree(null, parser));

const xeval = new EvalVisitor();
xeval.visit(tree);

console.log("finished");
