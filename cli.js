#!/usr/bin/env node

const commander = require("commander");
const package = require("./package.json");

function collect (value, previous) {
    return previous.concat([value]);
}

const program = new commander.Command()
    .description(package.description)
    .version(package.version)
    .arguments("<code...>")
    .option("-x, --explain")
    .option("-b, --before <code>", "Run code before", collect, [])
    .option("-a, --after <code>", "Run code after", collect, [])
    .option("-d, --delimiter <delimiter>", "Set the delimiter", "\\s+")
    // .option("--json")
    // .option("--csv")
    .action(async (code, options, command) => {
        const pjs = require(".");
        var generated;
        try {
            generated = pjs.generate({
                beforeJs: options.before.join("\n"),
                lineJs: code.join("\n"),
                afterJs: options.after.join("\n"),
                delimiter: (options.delimiter != null) ? new RegExp(options.delimiter) : null,
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
