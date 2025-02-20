#!/bin/bash

npm install # install dependencies of project defined in package.json
# to install antlr4 without minimized source:
#     npm uninstall antlr4
#     npm install antlr4-4.13.2.tgz # see README.md how to build it
# rebuild of antlr with webpack mode set to "development" instead of "production"

./generate.bash # generate type script from grammar in src/generated
tsc             # compile typescript code to javascript

# node out/main.js # run generated javascript main.js.  You could also run 'npm run start'

printf "\n\nBUILD DONE\n\n"
