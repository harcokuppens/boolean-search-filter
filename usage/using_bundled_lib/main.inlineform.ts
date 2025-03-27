import { BooleanSearch } from './BooleanSearch.bundled.es.js';

const customId = "mybooleansearch";
const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
new BooleanSearch().setId(customId)
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .apply();


