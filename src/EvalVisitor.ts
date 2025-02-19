import { evalString } from './evalString.js';
import BooleanExprVisitor from './generated/BooleanExprVisitor.js';
//import { AndExprContext, OrExprContext, ParenExprContext, StringExprContext, ImplicitOrExprContext } from './generated/BooleanExprParser.js';
import { AndExprContext, OrExprContext, ParenExprContext, StringExprContext, ImplicitAndExprContext, NotExprContext } from './generated/BooleanExprParser.js';

//declare function evalString(input: string): boolean;

export class EvalVisitor extends BooleanExprVisitor<boolean> {
    protected defaultResult(): boolean {
        return false;
    }

    private extraParam: string;
    private stringValues: string[] = [];

    constructor(extraParam: string) {
        super();
        this.extraParam = extraParam;
    }


    visitAndExpr = (ctx: AndExprContext): boolean => {
        const left = this.visit(ctx.expr(0));
        if (!left) return false;
        const right = this.visit(ctx.expr(1));
        return left && right;
    }

    visitOrExpr = (ctx: OrExprContext): boolean => {
        const left = this.visit(ctx.expr(0));
        if (left) return true;
        const right = this.visit(ctx.expr(1));
        return left || right;
    }

    // visitImplicitOrExpr = (ctx: ImplicitOrExprContext): boolean => {
    //     const left = this.visit(ctx.expr(0));
    //     if (left) return true;
    //     const right = this.visit(ctx.expr(1));
    //     return left || right;
    // }


    visitImplicitAndExpr = (ctx: ImplicitAndExprContext): boolean => {
        const left = this.visit(ctx.expr(0));
        if (!left) return false;
        const right = this.visit(ctx.expr(1));
        return left && right;
    }


    visitParenExpr = (ctx: ParenExprContext): boolean => {
        return this.visit(ctx.expr());
    }

    visitNotExpr = (ctx: NotExprContext): boolean => {
        return !this.visit(ctx.expr());
    }

    visitStringExpr = (ctx: StringExprContext): boolean => {
        const str = ctx.STRING().getText();
        // Remove surrounding quotes if present
        const unquotedStr = str.startsWith('"') && str.endsWith('"') ? str.slice(1, -1) : str;
        this.stringValues.push(unquotedStr);
        return evalString(unquotedStr, this.extraParam);
    }

    getStringValues(): string[] {
        return this.stringValues;
    }
}
