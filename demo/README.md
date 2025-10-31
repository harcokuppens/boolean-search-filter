# Demo

We demonstrate the `BooleanSearch` library by providing demo folders, where each demo
folder can be deployed on a webserver and will just work. This folder contains two
demo's:

1. `html_using_bundled_lib/` <br><br> This demo uses a bundled library file which
   consist of the npm package providing the BooleanSearch library bundled with all
   its npm dependent packages bundle into a single. The `index.html` contains the
   javascript which loads the BooleanSearch library and applies it to the current
   example. This main code looks like:

   ```html
   <html>
     <script type="module">
       import { BooleanSearch } from "./BooleanSearch.bundled.es.js";
       new BooleanSearch()
         .setAutoForm()
         .setSectionElementsCssSelector("#mycontent > h1")
         .setElementsCssSelector("li")
         .apply();
     </script>
     <body>
       ...
     </body>
   </html>
   ```

   <br>This demo is explained in detail in `usage/using_bundled_lib/`.

2. `vite_bundled_app/` <br><br> This demo is the result of the vite tool bundling all
   typescript of the webpage index.html, containing both the main code, and the
   library code into a single `bundle.js` file. The `index.html` only loads this
   `bundle.js` file which is then automatically is applied to the current html file.
   The code looks like:

   ```html
   <html>
     <script type="module" crossorigin src="./bundle.js"></script>
     <body>
       ...
     </body>
   </html>
   ```

   <br>This demo is explained in detail in
   `usage/using_npm_lib_bundled_with_deps_by_vite/`. The contents of this demo folder
   is taken from the dist/ folder which is created when you build the npm project in
   this folder.
