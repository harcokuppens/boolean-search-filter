#!/bin/bash

GRAMMAR="LabeledExpr"
LANGUAGE="Java"
antlr4 -no-listener -visitor -Dlanguage="${LANGUAGE}" -o src/generated grammar/"${GRAMMAR}.g4"
