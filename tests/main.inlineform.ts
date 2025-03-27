import { BooleanSearch } from '../src/BooleanSearch.ts';

const customId = "BooleanSearch";
const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
new BooleanSearch().setId(customId)
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .apply();


