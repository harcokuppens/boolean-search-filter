import { BooleanSearch } from '../src/BooleanSearch.ts';

// autoform with a different subscript
// This example shows how to use the autoform with a different subscript
const customId = "BooleanSearch";
const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
const subscript = '<small> <b> &nbsp;&nbsp;&nbsp; <a href="https://www.npmjs.com/package/boolean-search-filter"> boolean search supported</a></b></small>';
new BooleanSearch().setId(customId)
    .setAutoForm(subscript)
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .setHighlighting(false)
    .apply();

