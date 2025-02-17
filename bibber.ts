let message: string = 'Hello Wooorld';
console.log(message);


// export function myFunction() {
//     console.log("Hello from myFunction!");
// }

// // Attach it to global scope (optional, if you want to access it in the debugger)
// (window as any).myFunction = myFunction;


// //values: Array<string>
// function newmatchSimpleBooleanExpression(simpleBooleanExpr: string, input: string): [boolean, values: Array<string>] {

//     // A simpleBooleanExpr is a boolean expression with AND and OR but without parentheses. 
//     // The AND operator has higher priority.


//     // // first split on OR 
//     // const andExpressions: Array<string> = simpleBooleanExpr.split(/\s+/).filter((e) => e.trim().length > 0);

//     // for (const andExpression of andExpressions) {
//     //    orExpressions
//     // }

//     // Split the multivalue string on whitespace and filter out empty strings
//     const values: Array<string> = simpleBooleanExpr.split(/\s+/).filter((e) => e.trim().length > 0);
//     //  console.log("Parsed values to filter for:", values);

//     let foundMatch: boolean = false;
//     for (const value of values) {
//         const pos = input?.toLowerCase().indexOf(value.toLowerCase()) ?? -1;
//         if (pos > -1) {
//             foundMatch = true;
//             break;
//         }
//     }
//     //return foundMatch;
//     return [foundMatch, values];
// }
function matchSimpleBooleanExpression(simpleBooleanExpr: string, input: string): [boolean, values: Array<string>] {

    // Split the multivalue string on whitespace and filter out empty strings
    const values: Array<string> = simpleBooleanExpr.split(/\s+/).filter((e) => e.trim().length > 0);
    //  console.log("Parsed values to filter for:", values);

    let foundMatch: boolean = false;
    for (const value of values) {
        const pos = input?.toLowerCase().indexOf(value.toLowerCase()) ?? -1;
        if (pos > -1) {
            foundMatch = true;
            break;
        }
    }
    //return foundMatch;
    return [foundMatch, values];
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('button');
    const searchbox = document.getElementById('searchbox') as HTMLInputElement;
    const form = document.getElementById('searchForm') as HTMLFormElement;


    if (button) {
        button.addEventListener('click', function () {
            if (searchbox) {
                const searchvalues = searchbox.value;
                logfilter(searchvalues);
            }
        });
    }

    if (searchbox && button) {
        searchbox.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                // event.preventDefault();
                button.click();
            }
        });
    }
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission
        });
    }
});


function processSibling(sibling: Element, simpleBooleanExpr: string): boolean {

    // console.log("  Examining sibling:", sibling);

    // get nested li elements in sibbling (eg. in ol list)
    let foundAtLeastOneMatch: boolean = false;
    const liElements = sibling.querySelectorAll<HTMLLIElement>("li");
    liElements.forEach((li, index) => {

        //  console.log("    Found <li>: ", li.textContent?.trim());
        let foundMatch, values;
        if (li.textContent) [foundMatch, values] = matchSimpleBooleanExpression(simpleBooleanExpr, li.textContent);

        if (foundMatch && values) {
            // console.log("    Showing <li> and highlighting matches...");
            foundAtLeastOneMatch = true;

            // Unwrap any <mark> elements inside the list item
            li.querySelectorAll("mark").forEach((mark) => {
                // console.log("    Removing <mark> from <li>...");
                const parent = mark.parentNode!;
                while (mark.firstChild) {
                    parent.insertBefore(mark.firstChild, mark);
                }
                parent.removeChild(mark);
            });

            // Highlight each search term in the list item
            for (const value of values) {
                const regex = new RegExp(`(${value})(?=[^<]*<)`, "gi");
                li.innerHTML = li.innerHTML.replace(regex, "<mark>$1</mark>");
            }

            li.style.display = ""; // Show the <li> element
        } else {
            // console.log("    Hiding <li>...");
            li.style.display = "none"; // Hide the <li> element
        }

    });
    return foundAtLeastOneMatch;

}


function logfilter(simpleBooleanExpr: string) {
    console.log("Starting filter function...");
    console.log("Input simpleBooleanExpr:", simpleBooleanExpr);



    // Select all <h1> elements inside the element with ID 'wikitext'
    const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#wikitext > h1");
    console.log("Found <h1> elements:", h1Elements);

    h1Elements.forEach((h1, index) => {
        // console.log(`Processing <h1> element #${index + 1}:`, h1.textContent?.trim());
        let foundAtLeastOneMatch = false;

        // Get all elements between this <h1> and the next <h1>
        let sibling = h1.nextElementSibling;
        while (sibling && sibling.tagName !== "H1") {
            let foundMatch: boolean = processSibling(sibling, simpleBooleanExpr);
            if (foundMatch) {
                foundAtLeastOneMatch = true;
            }
            sibling = sibling.nextElementSibling;
        };

        // Show or hide the <h1> based on whether any list items were shown
        if (foundAtLeastOneMatch) {
            //  console.log(`  Showing <h1> since at least one <li> was shown: "${h1.textContent?.trim()}"`);
            h1.style.display = "";
        } else {
            //  console.log(`  Hiding <h1> since no matching <li> was found: "${h1.textContent?.trim()}"`);
            h1.style.display = "none";
        }
    });

    console.log("Filter function completed.");
}



// Attach it to global scope (optional, if you want to access it in the debugger)
(window as any).logfilter = logfilter;

function newfilter(multivalue: string) {
    // Split the multivalue string on whitespace and filter out empty strings
    const values = multivalue.split(/\s+/).filter((e) => e.trim().length > 0);

    // Select all <h1> elements inside the element with ID 'wikitext'
    const h1Elements = document.querySelectorAll<HTMLHeadingElement>("#wikitext > h1");

    h1Elements.forEach((h1) => {
        let onelishown = false;

        // Get all elements between this <h1> and the next <h1>
        let sibling = h1.nextElementSibling;
        while (sibling && sibling.tagName !== "H1") {
            if (sibling.tagName === "OL") {


                const li = sibling as HTMLLIElement;
                let doshow = false;

                for (const value of values) {
                    const pos = li.textContent?.toLowerCase().indexOf(value.toLowerCase()) ?? -1;
                    if (pos > -1) {
                        doshow = true;
                        break;
                    }
                }

                if (doshow) {
                    onelishown = true;

                    // Unwrap any <mark> elements inside the list item
                    li.querySelectorAll("mark").forEach((mark) => {
                        const parent = mark.parentNode!;
                        while (mark.firstChild) {
                            parent.insertBefore(mark.firstChild, mark);
                        }
                        parent.removeChild(mark);
                    });

                    // Highlight each search term in the list item
                    for (const value of values) {
                        const regex = new RegExp(`(${value})(?=[^<]*<)`, "gi");
                        li.innerHTML = li.innerHTML.replace(regex, "<mark>$1</mark>");
                    }

                    li.style.display = ""; // Show the <li> element
                } else {
                    li.style.display = "none"; // Hide the <li> element
                }
            }
            sibling = sibling.nextElementSibling;
        }

        // Show or hide the <h1> based on whether any list items were shown
        if (onelishown) {
            h1.style.display = "";
        } else {
            h1.style.display = "none";
        }
    });
}