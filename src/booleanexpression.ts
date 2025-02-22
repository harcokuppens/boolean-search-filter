import { CharStream, CommonTokenStream } from 'antlr4';
import BooleanExprLexer from './generated/BooleanExprLexer.js';
import BooleanExprParser, { ExprContext } from './generated/BooleanExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';
import { WordsVisitor } from './WordsVisitor.js';


export default class BooleanExpression {
    private exprContext: ExprContext;

    public constructor(booleanExpression: string) {
        this.exprContext = getParserTree(booleanExpression);
    }

    getWords(): string[] {
        return getWordsInBooleanExpr(this.exprContext);
    }

    match(text: string): boolean {
        return matchBooleanExpr(this.exprContext, text);
    }

    // directly match a boolean expression giving as string with a given text string
    // which is convenient for a single match for the expression, 
    // for multiple matches one better can create a BooleanExpression object.
    static match(booleanExpression: string, text: string): boolean {
        return new BooleanExpression(booleanExpression).match(text);
    }
}


// private constructor(exprContext: ExprContext) {
//     this.exprContext = exprContext;
// }

// static compile(booleanExpression: string): BooleanExpression {
//     const exprContext = getParserTree(booleanExpression);
//     return new BooleanExpression(exprContext);
// }

// Default export
//export default BooleanExpression;


//export { BooleanExpression as booleanExpression };


//export type { ExprContext };



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