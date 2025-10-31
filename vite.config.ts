import { defineConfig } from 'vite';

// build lib with all dependencies excluded; 
// app using this lib will have to include all dependencies which goes automatically with npm install
export default defineConfig({

    // 👇 Treat the `examples` folder as the root for dev server
    root: 'examples',
    // without base, the default is "base: '/'"
    //base: '/dist/', //   Vite will generate absolute paths from /dist/ ]
    base: '', // use an empty base to make vite generate relatieve paths => then you are free to move the dist folder anywhere on the web server!
    build: {
        outDir: 'dist',
        sourcemap: true,
        lib: {
            entry: 'src/BooleanSearch.ts',
            //   formats: ['es','umd'],
            name: 'BooleanSearch',
            //  do not set 'formats' , default value for it is ok.
            formats: ['es', 'cjs', 'umd', 'iife'], // autoname global problem with iife
            //fileName: (format) => `boolean-expression.${format}.js`
            fileName: (format, entryName) => `${entryName}.${format}.js`
        },


        rollupOptions: {
            // Ensure to externalize deps that shouldn't be bundled
            // into your library
            external: ['antlr4', '@harcokuppens/boolean-expression', '@harcokuppens/highlight-words'],
            output: {
                // set global names for the external libs for the UMD and IIFE build 
                // so that the programmer knows what to include under which name
                globals: {
                    antlr4: 'antlr4',
                    '@harcokuppens/boolean-expression': 'hk_boolean_expression',
                    '@harcokuppens/highlight-words': 'hk_highlight_words'
                },
                // entryFileNames: 'booleansearch.[format].js', // custom name for the JS file
                // assetFileNames: '[name][extname]', // keep the original name for the assets
                //dir: 'dist' // output folder (default is outDir in build)
            }
        },
    }
});