#!/usr/bin/env node

"use strict";

const commander = require("commander");
const pkg = require("./package.json");

function collect (value, previous) {
    if (previous == null) {
        previous = [];
    }
    return previous.concat([value]);
}

const program = new commander.Command()
    .description(pkg.description)
    .version(pkg.version)
    .arguments("<script...>")
    .option("-x, --explain", "Print generated program instead of running it")
    .option("-b, --before <script>", "Run script before parsing", collect)
    .option("-a, --after <script>", "Run script after parsing", collect)
    .option("-d, --delimiter <delimiter>", "The delimiter for text parsing", "\\s+")
    .option("--csv", "Parse input as CSV")
    .option("--csv-header", "Parse input as CSV with a column header")
    .option("--json <filter>", "Parse input as JSON")
    .action(async (script, options, command) => {
        const pjs = require(".");
        var generated;
        try {
            let mode = null;
            if (options.csv || options.csvHeader) {
                mode = "csv";
            } else if (options.json) {
                mode = "json";
            }
            generated = pjs.generate({
                mode,
                beforeJs: options.before ? options.before.join("\n") : null,
                lineJs: script.join("\n"),
                afterJs: options.after ? options.after.join("\n") : null,
                textDelimiter: (options.delimiter != null) ? new RegExp(options.delimiter) : null,
                csvHeader: options.csvHeader,
                jsonFilter: options.json,
            });
        } catch (error) {
            // console.error("Parse error: "+error.message);
            console.error(error);
            process.exit(1);
        }
        if (options.explain) {
            console.log(generated);
        } else {
            try {
                await eval(generated);
            } catch (error) {
                // TODO(2021-01-16): Better error handling
                console.error(error);
                process.exit(1);
            }
        }
    });

program.parse();
