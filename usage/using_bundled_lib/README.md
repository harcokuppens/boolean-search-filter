# Boolean search example application using bundled library

## Description

When using the bundled BooleanSearch library we can create a simple html file which
has javascript which imports the library and applies it to create a boolean search
box for entries in that html file. No need for complited build tools like vite.

## Setup instructions

Below are the instructions to get a working web app with `index.html`, `main.ts` and
the bundled lib:

```bash
# build in root of project a bundled library in dist_bundledlib/ folder
( cd ../../ && npm run buildbundled )
# cp dist_bundledlib/BooleanSearch.es.js to current folder
cp ../../dist_bundledlib/* .
# main.ts imports /BooleanSearch.es.js
# transpile main.ts to main.js
tsc --target es2022 --module  es2022  --moduleResolution node --sourcemap main.ts
# open index.html which uses main.js in webserver
npx http-server -a localhost -p 1234 -o index.html
```

Note: instead of writing a main.ts we could also have written a main.js file directly
or even have no main.js at all but have all javascript code directly in the html
file. For latter example see `index.inlinejs.html` which we can open with:

```
npx http-server -a localhost -p 1234 -o index.inlinejs.html
```

Note: above setup instructions are in `./setup.bash` and we can cleanup generated
files with `./clean.bash`.
