# Boolean search example application using bundled library

## Description

When using the bundled BooleanSearch library we can create a simple html file which
has javascript which imports the bundled library and applies it to create a boolean
search box for entries in that html file. No need for complicated build tools like
vite.

In the project's main README we explain the details of how to use the bundled
library.

In the current folder we have a setup bash script which builds and installs the
bundled library into the current folder so that the 6 `HTML` example files in this
folder can be demonstrated in a browser when running current folder in a webserver.
When running the `setup.bash` script this also automaticatically opens a webserver
and a webbrowser for you.

## Examples

We have six different examples caused by combination of:

- type of code

  - **main_ts**: example uses a main.ts script
  - **inline_js**: example uses inline javascript in the html file

- type of form

  - **inlineform**: form provided in html
  - **injectform**: a user defined form injected in html with js function
  - **autoform**: default form injected by library in html with js function

which gives us the following examples:

- \_main_ts.inlineform.html
- \_main_ts.injectform.html
- \_main_ts.autoform.html
- \_inline_js.inlineform.html
- \_inline_js.injectform.html
- \_inline_js.autoform.html

## Setup instructions

Below are the most important instructions from the `setup.bash` script to get a
working web app with the bundled lib:

```bash
# build in root of project a bundled library in dist_bundledlib/ folder
( cd ../../ && npm run buildbundled )
# cp dist_bundledlib/BooleanSearch.es.js to current folder
cp ../../dist_bundledlib/* .
# cp typescript types of BooleanSearch to current folder as BooleanSearch.es.d.ts
# This is ok, because bundled library is in ES module format and and exports typescript
# types of BooleanSearch class. Without the .d.ts file the IDE will complain about types.
cp ../../types/BooleanSearch.d.ts BooleanSearch.bundled.es.d.ts
# note: main.X.ts imports ./BooleanSearch.bundled.es.js
# transpile all main.X.ts to main.X.js
tsc --target es2022 --module  es2022  --moduleResolution node --sourcemap main.*.ts
# start webserver and open root folder to open examples folder
npx http-server -a localhost -p 1234 -o
# click on specific example html file to see how it works.
```

Note: above setup instructions are in `./setup.bash` and we can cleanup generated
files with `./clean.bash`. However for convenience the generated files are now
included in the repository, making it possible to preview the `html` files directly
without generating code first. For viewing them in action we do need webserver though
like above `npx http-server`. For vscoded you could also use the 'Live preview'
extension.
