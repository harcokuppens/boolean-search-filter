export declare namespace BooleanSearch {
    type filterAndMarkElementsFunc = (nodes: NodeListOf<HTMLElement>) => boolean;
}
export declare class BooleanSearch {
    private htmlPageSpecificFilterAndMarkCallback;
    private elementsCssSelectorForItems;
    private elementsCssSelectorForSectionItems;
    private highlightingActive;
    private id;
    setAutoForm(): this;
    setForm(formString: string): this;
    setId(id: string): this;
    setElementsCssSelector(elementsCssSelector: string): this;
    setSectionElementsCssSelector(elementsCssSelector: string): this;
    setHtmlPageSpecificFilterAndMarkCallback(callback: (fn: BooleanSearch.filterAndMarkElementsFunc) => boolean): this;
    setHighlighting(active: boolean): this;
    apply(): void;
    private searchFilter;
    private elementsPageFilterAndMarkCallback;
    private sectionedElementsPageFilterAndMarkCallback;
    private filterAndMarkElementsMatchingBooleanExpression;
}
//# sourceMappingURL=BooleanSearch.d.ts.map