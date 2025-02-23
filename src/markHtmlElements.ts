export function markText(rootNode: HTMLElement, word: string) {
    // word can also be empty string "" which we do not mark!
    if (word == "") return;
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null);
    let node;
    while (node = walker.nextNode()) {
        const parentNode = node.parentNode!;
        const regex = new RegExp(`(${word})`, 'gi');
        if (node.nodeValue && regex.test(node.nodeValue)) {
            // create new html text from text in textnode 
            const newHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
            // place this text in a div element as innerHTML making the text being parsed as html!
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;
            // take the newly html nodes inside the div (tempDiv.firstChild) and place it in parentnode
            //  as child before node (we are changing), then remove this old node from parent. (only remaining the newly html nodes in the parent node) 
            while (tempDiv.firstChild) {
                parentNode.insertBefore(tempDiv.firstChild, node);
            }
            parentNode.removeChild(node);
        }
    }
}

export function unMarkText(rootNode: HTMLElement) {
    // Unwrap any <mark> elements inside the item from previous search
    rootNode.querySelectorAll("mark").forEach((mark) => {
        const parent = mark.parentNode!;
        while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
            // bla <mark>textinside</mark>  --> bla textinside<mark>textinside</mark>
        }
        parent.removeChild(mark);
        // bla textinside<mark>textinside</mark> -> bla textinside
        parent.normalize(); // after removing mark tags we get multiple adjacent text nodes, with normalized they get merged into one
        // without normalizing a split text could not be matched by a next search anymore
    });
}