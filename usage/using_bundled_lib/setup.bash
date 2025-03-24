#!/bin/bash

# build in root of project a bundled library in dist_bundledlib/ folder
(cd ../../ && npm run buildbundled)
# cp dist_bundledlib/BooleanSearch.es.js to current folder
cp ../../dist_bundledlib/* .
# cp typescript types of BooleanSearch to current folder as BooleanSearch.es.d.ts
# This is ok, because bundled library is in ES module format and and exports typescript types of BooleanSearch class
cp ../../types/BooleanSearch.d.ts BooleanSearch.es.d.ts
# main.ts imports /BooleanSearch.es.js
# transpile main.ts to main.js
tsc --target es2022 --module es2022 --moduleResolution node --sourcemap main.ts
# open index.html which uses main.js in webserver
npx http-server -a localhost -p 1234 -o index.html
