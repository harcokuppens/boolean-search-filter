#!/bin/bash

# build in root of project a bundled library in dist_bundledlib/ folder
(cd ../../ && npm run buildbundled)
# cp dist_bundledlib/BooleanSearch.es.js to current folder
cp ../../dist_bundledlib/* .
# cp typescript types of BooleanSearch to current folder as BooleanSearch.es.d.ts
# This is ok, because bundled library is in ES module format and and exports typescript
# types of BooleanSearch class. Without the .d.ts file the IDE will complain about types.
cp ../../types/BooleanSearch.d.ts BooleanSearch.bundled.es.d.ts
# main.ts imports /BooleanSearch.es.js
# transpile main.ts to main.js
tsc --target es2022 --module es2022 --moduleResolution node --sourcemap main.*.ts
# open index.html which uses main.js in webserver
INSTRUCTIONS="

EXAMPLES
    We have six examples caused by combination of:
    a) type of code 
        - main_ts:  example uses a main.ts script 
        - inline_js: example uses inline javascript in the html file
    b) type of form
        - inlineform: form provided in html 
        - injectform: a user defined form injected in html with js function 
        - autoform: default form injected by library in html with js function
    which gives us the following examples: 

        http://localhost:1234/_main_ts.inlineform.html 
        http://localhost:1234/_main_ts.injectform.html  
        http://localhost:1234/_main_ts.autoform.html    
        http://localhost:1234/_inline_js.inlineform.html      
        http://localhost:1234/_inline_js.injectform.html
        http://localhost:1234/_inline_js.autoform.html

INSTRUCTIONS
   The browsers opens a folder listing of files in this folder.
   Click on the file you want to see the example of.

"
echo "$INSTRUCTIONS"
# start webserver in current folder
NODE_OPTIONS='--disable-warning=ExperimentalWarning --disable-warning=DeprecationWarning' NPM_CONFIG_LOGLEVEL=silent npx http-server -s -a localhost -p 1234 -o
