import { CharStream, CommonTokenStream } from 'antlr4';
import BooleanExprLexer from './generated/BooleanExprLexer.js';
import BooleanExprParser, { ExprContext } from './generated/BooleanExprParser.js';
import { EvalVisitor } from './EvalVisitor.js';
import { WordsVisitor } from './WordsVisitor.js';

export default class BooleanExpression {
    private lexer: BooleanExprLexer;
    private tokenStream: CommonTokenStream;
    private parser: BooleanExprParser;
    private tree: ExprContext;
    private wordsUsedInMatch: string[];

    public constructor(booleanExpression: string) {
        this.lexer = new BooleanExprLexer(new CharStream(booleanExpression));
        this.tokenStream = new CommonTokenStream(this.lexer);
        this.parser = new BooleanExprParser(this.tokenStream);
        this.tree = this.parser.expr();
        // Check for errors, and if so throw exception to be handled higher up
        if (this.parser.syntaxErrorsCount > 0) {
            throw new SyntaxError();
        }
        this.wordsUsedInMatch = [];
    }

    // method to log tokens, for debugging grammar
    logTokens() {
        let symbols: (string | null)[] = this.lexer.symbolicNames;
        this.tokenStream.fill();
        this.tokenStream.tokens.forEach((token) => {
            const tokenName = symbols[token.type] || token.type;
            console.log(`Type: ${token.type}, Name: ${tokenName}, Text: '${token.text}'`);
        });
    }

    // get words used in boolean search expression
    getWords(): string[] {
        const wordsVisitor = new WordsVisitor();
        wordsVisitor.visit(this.tree);
        return wordsVisitor.getStringValues();
    }

    // check whether given text matches the boolean expression
    match(text: string): boolean {
        const evalVisitor = new EvalVisitor(text);

        let foundMatch = evalVisitor.visit(this.tree);
        if (foundMatch) {
            this.wordsUsedInMatch = evalVisitor.getStringValues();
        } else {
            this.wordsUsedInMatch = [];
        }
        return foundMatch;
    }

    // get words visited in evaluation of boolean search expression to come to positive match
    getWordsUsedInLastMatch() {
        return this.wordsUsedInMatch;
    }

    // directly match a boolean expression giving as string with a given text string
    // which is convenient for a single match for the expression, 
    // for multiple matches one better can create a BooleanExpression object.
    static match(booleanExpression: string, text: string): boolean {
        return new BooleanExpression(booleanExpression).match(text);
    }
}