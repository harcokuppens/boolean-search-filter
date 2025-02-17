
import { ParserRuleContext } from 'antlr4';
//import MyGrammarVisitor from './MyGrammarVisitor';

import LabeledExprVisitor from './generated/LabeledExprVisitor.js';

import { ProgContext } from "./generated/LabeledExprParser.js";
//import { StatContext } from "./generated/LabeledExprParser.js";
import { PrintExprContext } from "./generated/LabeledExprParser.js";
import { AssignContext } from "./generated/LabeledExprParser.js";
import { BlankContext } from "./generated/LabeledExprParser.js";
import { ParensContext } from "./generated/LabeledExprParser.js";
import { MulDivContext } from "./generated/LabeledExprParser.js";
import { AddSubContext } from "./generated/LabeledExprParser.js";
import { IdContext } from "./generated/LabeledExprParser.js";
import { IntContext } from "./generated/LabeledExprParser.js";



// class CustomVisitor extends LabeledExprVisitor<number> {

//     visitChildren(ctx: ParserRuleContext) {
//         if (!ctx) {
//             return;
//         }
//         if (ctx.children) {
//             return ctx.children.map(child => {
//                 if (child.children && child.children.length != 0) {
//                     return child.accept(this);
//                 } else {
//                     return child.getText();
//                 }
//             });
//         }
//     }
// }


//class EvalVisitor {
export class EvalVisitor extends LabeledExprVisitor<number> {

    /** "memory" for our calculator; variable/value pairs go here */
    private memory: Map<string, number> = new Map<string, number>();


    /**
     * Visit a parse tree produced by `LabeledExprParser.prog`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProg = (ctx: ProgContext): number => {
        for (var child of ctx.stat_list()) {
            this.visit(child);
        }
        return 0; // return dummy value
    }


    /** ID '=' expr */
    visitAssign = (ctx: AssignContext): number => {
        const id = ctx.ID().getText(); // id is left-hand side of '='
        const value = this.visit(ctx.expr()); // compute value of expression on right
        this.memory.set(id, value); // store it in our memory
        return value;
    }



    /** expr NEWLINE */
    visitPrintExpr = (ctx: PrintExprContext): number => {
        const value = this.visit(ctx.expr()); // evaluate the expr child
        console.log(value); // print the result
        return 0; // return dummy value
    }

    /** INT */
    visitInt = (ctx: IntContext): number => {
        return parseInt(ctx.INT().getText(), 10);
    }

    /** ID */
    visitId = (ctx: IdContext): number => {
        const id = ctx.ID().getText();
        if (this.memory.has(id)) {
            return this.memory.get(id) as number;
        }
        return 0;
    }

    /** expr op=('*'|'/') expr */
    visitMulDiv = (ctx: MulDivContext): number => {
        const left = this.visit(ctx.expr(0)); // get value of left subexpression
        const right = this.visit(ctx.expr(1)); // get value of right subexpression
        // ctx._op

        // if (ctx._op.text === 'MUL') return left * right;
        if (ctx._op === ctx.MUL().symbol) return left * right;
        return Math.floor(left / right); // must be DIV, with flooring for integers
    }

    /** expr op=('+'|'-') expr */
    visitAddSub = (ctx: AddSubContext): number => {
        const left = this.visit(ctx.expr(0)); // get value of left subexpression
        const right = this.visit(ctx.expr(1)); // get value of right subexpression
        //ctx.ADD().getText()
        //ctx.getTokens
        // ctx.ADD().symbol.type 
        //ctx._op.type


        if (ctx._op === ctx.ADD().symbol) return left + right;
        return left - right; // must be SUB
    }

    /** '(' expr ')' */
    visitParens = (ctx: ParensContext): number => {
        return this.visit(ctx.expr()); // return child expr's value
    }

    // /** Generic visit method 
    //    ==> no need to implement already implemented in ParseTreeVisitor
    //       ./node_modules/antlr4/src/antlr4/tree/ParseTreeVisitor.d.ts  typescript type interface
    //       ./node_modules/antlr4/dist/antlr4.node.mjs  -> javascript implementation
    // */
    // visit = (ctx: ParserRuleContext): number => {
    //     // This method dispatches to the correct visit* method based on the context type.
    //     if (ctx instanceof AssignContext) return this.visitAssign(ctx);
    //     if (ctx instanceof PrintExprContext) return this.visitPrintExpr(ctx);
    //     if (ctx instanceof IntContext) return this.visitInt(ctx);
    //     if (ctx instanceof IdContext) return this.visitId(ctx);
    //     if (ctx instanceof MulDivContext) return this.visitMulDiv(ctx);
    //     if (ctx instanceof AddSubContext) return this.visitAddSub(ctx);
    //     if (ctx instanceof ParensContext) return this.visitParens(ctx);
    //     if (ctx instanceof ProgContext) return this.visitProg(ctx);
    //     //        if (ctx instanceof StatContext) return this.visitStat(ctx);
    //     throw new Error("Unsupported context type");
    // }
}
