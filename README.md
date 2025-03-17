# Boolean search

On websites listing many items one sometimes wants to filter the items listed. This
project provides a boolean expression evaluator in typescript with which you can
create a boolean expression with some search words.

Example:

```
   ("machine learning" OR "artificial intelligence") AND NOT "image recognition"
```

In typescript code we parse a boolean expression of strings, to filter which set of
items out of a list of items should be displayed in an html page.

The boolean expression is applied to each item, and when `true` the item is selected
to be shown in html, and when `false` the item is hidden in html, causing only `true`
items to be shown.

The boolean expression contains strings, where each string is only evaluated true
when this string is contained (case insensitive) in the item. Only when the complete
boolean expression is `true` on the item, only then it will be shown.

## Sources

- grammar/LabeledExpr.g4 - ANTLR4 grammar for boolean expression
- src/main.ts - main script which runs given boolean expression agains a list of text
  items, only the items which are evaluated true are shown in html; false items are
  hidden in html.
- src/EvalVisitor.ts - evaluates boolean expression where each STRING in the boolean
  expression is matched against given text giving true if matched and false if not
  matched. The STRINGs evaluated to a boolean value are combined in the boolean
  expression to give an overall boolean value.
- src/WordsVisitor.ts - gets all words used in the boolean expression to make them
  highlighted in the match shown in html

## How to use

First build with a bash script:

```bash
./build.bash
```

The build script does

```bash
npm install # install dependencies of project defined in package.json
            # to install antlr4 without minimized source:
            #     npm uninstall antlr4
            #     npm install antlr4-4.13.2.tgz # see below how to build it
            # rebuild of antlr with webpack mode set to "development" instead of "production"

./generate.bash # generate type script from grammar in src/generated
tsc  # compile typescript code to javascript
```

Then run `out/main.js` with `node.js` execution environment (none-browser) :

```bash
node out/main.js # run generated javascript main.js.  You could also run 'npm run start'
```

Or run the `main.js` via `bibber.html` in a browser using a fresh launched webserver:

```bash
./launch_in_webserver.bash
```

## How to debug

In vscode there are two debug modes:

- "Launch main.js in node" Debug `main.js` in the node.js execution environment. All
  browser specific code in main.js is disabled.
- "Launch bibber.html(and main.js ) in webserver (requires Webserver task running)"
  Debug `main.js` in browser execution environment. Before lauching this debug mode
  your first have to launch the "Start Webserver" task. When launched the Edge
  browser is opened with the `bibber.html` file. You can place breakpoints in your
  typescript code. When an action in the browser causes javascript code to execute,
  the debugger will stop at the related line of code in your typescript source using
  map files.

## How to distribute

```sh
./distribute.bash
```

This will place all the necessary files in `dist/`, including an optimized version of
`antlr4.web.mjs`. You can copy the content of this folder to a webserver and open
`bibber.html` and everything should work.

## Cleanup project for git

```bash
./clean.bash
```

All generated files are cleaned up. All what remains is not redundant, and should be
committed to git.

## Appendix: antlr for debugging

When having a webpack file debugging is an hassle because the source in it is
minimized. When we step into code at some point we see minimized (javascript) code in
the webpack file which is unreadable. Solution: rebuild the webpack not minimized and
use that in your project. => allows use to step into the packed source and to even
put breakpoints there

0. get antlr4 source code

   ```bash
    cd /tmp/
    git clone https://github.com/antlr/antlr4/
    cd antlr4/runtime/JavaScript/
   ```

1. install webpack tool

   ```bash
   npm install -g webpack # installs webpack tool globally
   ```

2. edit webpack.config.js in which we change mode: "production" into "development" in
   buildConfig object.

3. run:

   ```bash
   npm install # install antlr4's project dependencies
   webpack # make webbundle in dist folder
   ```

4. to also include the javascript sources in the webpack change in `package.json` the
   lines

   ```
   "files": [
      "dist",
      "src/**/*.d.cts",
      "src/**/*.d.ts"
   ],
   ```

   into

   ```
   "files": [
      "dist",
      "src/"
   ],
   ```

5. use newly build webbundle:

   ```
   npm install -g # to install current build globally

         or

   npm pack # to make a tgz (Eg. antlr4-4.13.2.tgz), and that package you can
            # install locally in your project with
   cp antlr4-4.13.2.tgz  $PROJECTDIR
   cd $PROJECTDIR
   npm install antlr4-4.13.2.tgz
   ```
