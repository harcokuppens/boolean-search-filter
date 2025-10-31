import { BooleanSearch } from '../src/BooleanSearch.ts';

const customId = "BooleanSearch";
const formString: string = `       
<b> injected custom form </b>
<form id="${customId}_searchForm">
    <input id="${customId}_searchbox" type="text" aria-label="Type boolean search expression here..." style="width: 500px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; " />
    <button id="${customId}_button" type="button" aria-label="Do Search">
    Search
    </button>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <label>
    Case Sensitive <input type="checkbox" id="${customId}_checkbox" > 
    </label>
    <br>
    <small> <b> &nbsp;&nbsp;&nbsp; <a href="https://www.npmjs.com/package/boolean-search-filter"> boolean search supported</a>: </b> eg. (John OR "Jane Smith") AND NOT journal </small>
</form>
<div id="${customId}_error" style="color: red; font-weight: bold"></div>
<div id="${customId}_answer"></div>
`;


const sectionElementsCssSelector = "#mycontent > h1";
const elementsCssSelector = "li";
new BooleanSearch().setId(customId)
    .setForm(formString)
    .setSectionElementsCssSelector(sectionElementsCssSelector)
    .setElementsCssSelector(elementsCssSelector)
    .apply();


