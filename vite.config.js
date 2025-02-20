import { defineConfig } from 'vite';

export default defineConfig({
    // zonder base, de default is "base: '/'"
    //base: '/dist/', // Hiermee zeg je tegen Vite dat alle gegenereerde paden vanaf /dist/ moeten werken
    base: '', // Gebruik een lege base voor relatieve paden => je kunt content van dist folder overal op de webserver plaatsen!
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'bibber.html',
            output: {
                entryFileNames: 'booleansearch.js', // Verandert de JS bestandsnaam
                assetFileNames: '[name][extname]', // Houdt CSS en andere assets netjes
                dir: 'dist' // Zet alle bestanden direct in dist/
            }
        }
    }
});