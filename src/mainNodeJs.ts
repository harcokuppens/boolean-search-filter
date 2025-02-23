
import BooleanExpression from './booleanexpression.js';

const booleanExpr = "(kuppens AND vaAn) or aarts";
const line = "paper by vaandrager adn harco kuppens ";

//const tree = getParserTree(simpleBooleanExpr);
const boolexpr = new BooleanExpression(booleanExpr);

boolexpr.logTokens();

//const foundMatch = matchBooleanExpr(tree, line)
let foundMatch = boolexpr.match(line)

// const evalVisitor = new EvalVisitor(line);
// const foundMatch = evalVisitor.visit(tree);
// const values = evalVisitor.getStringValues();

console.log("foundMatch: " + foundMatch.toString());
//console.log("words used in match: " + values.toString());


// const wordsVisitor = new WordsVisitor();
// wordsVisitor.visit(tree);
// const words = wordsVisitor.getStringValues();

//const words = getWordsInBooleanExpr(tree);
const words = boolexpr.getWords();
console.log("words in expression: " + words.toString());
const wordsused = boolexpr.getWordsUsedInLastMatch();
console.log("getWordsUsedInLastMatch: " + wordsused.toString());

foundMatch = boolexpr.match("paper by harco kuppens and aarts")
console.log("foundMatch: " + foundMatch.toString());

foundMatch = BooleanExpression.match("hallo or boe", "boek");
console.log("foundMatch: " + foundMatch.toString());
foundMatch = BooleanExpression.match("hallo or boe", "bah");
console.log("foundMatch: " + foundMatch.toString());


try {
    const wrongexpr = new BooleanExpression("boek or");
} catch (exception) {
    console.log("Error in boolean search term");
}

