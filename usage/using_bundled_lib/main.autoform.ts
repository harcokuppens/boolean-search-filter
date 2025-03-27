import { BooleanSearch } from './BooleanSearch.bundled.es.js';

// autoform
const customId = "mybooleansearch";
const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
new BooleanSearch().setId(customId)
    .setAutoForm()
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .apply();

