import { defineConfig } from 'vite';


// build a bundled lib with all dependencies included
export default defineConfig({
    // without base, the default is "base: '/'"
    //base: '/dist/', //   Vite will generate absolute paths from /dist/ ]
    base: '', // use an empty base to make vite generate relatieve paths => then you are free to move the dist folder anywhere on the web server!
    build: {
        outDir: 'dist_bundledlib',
        sourcemap: true,
        lib: {
            entry: 'src/BooleanSearch.ts',
            //   formats: ['es','umd'],
            name: 'BooleanSearch',
            //  do not set 'formats' , default value for it is ok.
            formats: ['es'],
            //fileName: (format) => `boolean-expression.${format}.js`
            fileName: (format, entryName) => `${entryName}.bundled.${format}.js`
        }
    }
});