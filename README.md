# Simple expression evaluator in typescript

## Sources

- grammar/LabeledExpr.g4
- src/main.ts
- src/EvalVisitor.ts

## How to use

```bash

npm install # install dependencies of project defined in package.json
            # to install antlr4 without minimized source:
            #     npm uninstall antlr4
            #     npm install antlr4-4.13.2.tgz # see below how to build it
            # rebuild of antlr with webpack mode set to "development" instead of "production"

./generate.bash # generate type script from grammar in src/generated
tsc  # compile typescript code to javascript
node out/main.js # run generated javascript main.js.  You could also run 'npm run start'

```

cleanup

```bash

rm -rf node_modules/ src/generated/ out/
```

## appendix: antlr for debugging

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

4. use newly build webbundle:

   ```
   npm install -g # to install current build globally

         or

   npm pack # to make a tgz (Eg. antlr4-4.13.2.tgz), and that package you can
            # install locally in your project with
   cp antlr4-4.13.2.tgz  $PROJECTDIR
   cd $PROJECTDIR
   npm install antlr4-4.13.2.tgz
   ```
