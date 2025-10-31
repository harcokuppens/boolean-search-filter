import { BooleanSearch } from '../src/BooleanSearch.ts';

// autoform
const customId = "BooleanSearch";
const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
new BooleanSearch().setId(customId)
    .setAutoForm()
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .setHighlighting(false)
    .apply();

