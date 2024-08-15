"use strict";

function printReport(pages) {
    console.log("\nGenerating report...");
    const sortedPages = sortPages(pages);
    for (const page of sortedPages) {
        const url = page[0];
        const count = page[1];
        console.log(`Found ${count} internal links to ${url}`);
    }
}

function sortPages(pages) {
    const sortedPages = Object.entries(pages);
    sortedPages.sort((a, b) => {
        if (a[1] === b[1]) {
            return a[0].localeCompare(b[0]);
        }
        return b[1] - a[1];
    });
    return sortedPages;
}

export { printReport, sortPages };
