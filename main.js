"use strict"

import { argv } from "node:process";
import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
    if (argv.length !== 3) {
        console.log(`Usage: node main.js <baseURL>`);
        return
    }

    const baseURL = argv[2];
    const result = await crawlPage(baseURL);
    printReport(result);
}

await main();
