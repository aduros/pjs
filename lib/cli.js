"use strict";

const commander = require("commander");
const pkg = require("../package.json");

function collect (value, previous) {
    if (previous == null) {
        previous = [];
    }
    return previous.concat([value]);
}

module.exports = function () {
    return new commander.Command()
        .description(pkg.description+"\n\nFor complete documentation, run `man pjs` or visit https://github.com/aduros/pjs")
        .arguments("[script-text]")
        .arguments("[file...]")
        .option("-x, --explain", "Print generated program instead of running it")
        .option("-b, --before <script-text>", "Run script before parsing", collect)
        .option("-a, --after <script-text>", "Run script after parsing", collect)
        .option("-f, --file <script-file>", "Load script from a file")
        .option("-d, --delimiter <delimiter>", "The delimiter for text parsing", "\\s+")
        .option("--csv", "Parse input as CSV")
        .option("--csv-header", "Parse input as CSV with a column header")
        .option("--json <filter>", "Parse input as JSON")
        .option("--html <selector>", "Parse input as HTML")
        .option("--xml <selector>", "Parse input as XML")
        .version(pkg.version)
}
