grammar BooleanExpr;
options { caseInsensitive = true; }

expr:  NOT expr       # NotExpr 
    | expr AND expr   # AndExpr
    | expr  expr      # ImplicitAndExpr
    | expr OR expr    # OrExpr
    | '(' expr ')'    # ParenExpr  
    | EMPTY           # EmptyExpr
    | STRING          # StringExpr  
    ;



AND:  'AND' | '&&' | '&' ;
OR: 'OR'  | '||' | '|';
NOT: 'NOT' | '!' ;
STRING: '"' (~["\r\n])* '"' | ~[ \t\r\n()!|&]+ ;

EMPTY: ;

WS: [ \t\r\n]+ -> skip;
