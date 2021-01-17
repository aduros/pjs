"use strict";

const escodegen = require("escodegen");
const estraverse = require("estraverse");
const b = require("ast-types").builders;

function parse (js, replacements) {
    const acorn = require("acorn");
    const ast = acorn.parse(js, {ecmaVersion: 2020});

    if (replacements) {
        function replace (node) {
            if (node.type == "Identifier" && node.name in replacements) {
                return replacements[node.name];
            }
        }
        estraverse.replace(ast, {
            enter (node, parent) {
                if (node.type == "ExpressionStatement") {
                    if (parent.type == "BlockStatement") {
                        const statements = replace(node.expression);
                        if (statements != null) {
                            const idx = parent.body.indexOf(node);
                            parent.body.splice(idx, 1, ...statements);
                            return estraverse.VisitorOption.Skip;
                        }
                    }
                } else {
                    return replace(node);
                }
            },
        });
    }

    return ast;
}

module.exports = opts => {
    const beforeJs = opts.beforeJs;
    const lineJs = opts.lineJs;
    const afterJs = opts.afterJs;

    const mode = opts.mode;
    const csvHeader = opts.csvHeader;
    const jsonFilter = opts.jsonFilter;
    const textDelimiter = opts.textDelimiter;

    const lineAst = parse(lineJs);

    const initConsts = [];
    const initVars = [];

    const implicitAssigns = new Set();
    const implicitRequires = new Set();
    let hasDollar = false;

    estraverse.replace(lineAst, {
        enter (node) {
            switch (node.type) {
            case "Identifier":
                if (node.name == "$") {
                    hasDollar = true;

                } else if (node.name.match(/\$\d+/)) {
                    hasDollar = true;
                    return {
                        type: "MemberExpression",
                        object: {type: "Identifier", name: "$"},
                        property: {type: "Literal", value: parseInt(node.name.substr(1), 10)},
                        computed: true,
                        optional: false,
                    }

                } else {
                    switch (node.name) {
                    // https://github.com/sindresorhus/builtin-modules/blob/HEAD/builtin-modules.json
                    case "assert": case "async_hooks": case "buffer": case "child_process":
                    case "cluster": case "console": case "constants": case "crypto": case "dgram":
                    case "dns": case "domain": case "events": case "fs": case "http": case "http2":
                    case "https": case "inspector": case "module": case "net": case "os":
                    case "path": case "perf_hooks": case "process": case "punycode":
                    case "querystring": case "readline": case "repl": case "stream":
                    case "string_decoder": case "timers": case "tls": case "trace_events":
                    case "tty": case "url": case "util": case "v8": case "vm": case "wasi":
                    case "worker_threads": case "zlib":
                        implicitRequires.add(node.name);
                        break;
                    }
                }
                break;

            case "UpdateExpression":
                if (node.argument.type == "Identifier") {
                    implicitAssigns.add(node.argument.name);
                }
                break;

            case "AssignmentExpression":
                if (node.left.type == "Identifier") {
                    implicitAssigns.add(node.left.name);
                }
                break;
            }
        }
    });
    if (hasDollar && !mode) {
        const preamble = parse("const $ = _.split(DELIM)", {
            DELIM: b.literal(textDelimiter),
        }).body;
        lineAst.body = preamble.concat(lineAst.body);
    }
    for (const name of implicitRequires) {
        const expr = b.callExpression(b.identifier("require"), [b.literal(name)]);
        initConsts.push(b.variableDeclarator(b.identifier(name), expr));
    }
    for (const name of implicitAssigns) {
        initVars.push(b.variableDeclarator(b.identifier(name), b.literal(0)));
    }

    const lastStatement = lineAst.body[lineAst.body.length-1];
    if (lastStatement.type == "ExpressionStatement") {
        const additionalStatements = parse(`
            const _result = LAST_EXPR;
            if (_result === true) {
                print(_);
            } else if (_result !== false && _result != null) {
                print(_result);
            }
        `, {
            LAST_EXPR: lastStatement.expression,
        }).body;
        lineAst.body.pop();
        lineAst.body = lineAst.body.concat(additionalStatements);
    }

    let beforeAst;
    if (beforeJs) {
        beforeAst = parse(beforeJs);
    }

    let afterAst;
    if (afterJs) {
        afterAst = parse(afterJs);
        const lastAfterStatement = afterAst.body[afterAst.body.length-1];
        if (lastAfterStatement.type == "ExpressionStatement") {
            const additionalStatements = parse(`
                const _result = LAST_EXPR;
                if (_result != null) {
                    print(_result);
                }
            `, {
                LAST_EXPR: lastAfterStatement.expression,
            }).body;
            afterAst.body.pop();
            afterAst.body = afterAst.body.concat(additionalStatements);
        }
    }

    const initStatements = [];
    if (initConsts.length > 0) {
        initStatements.push(b.variableDeclaration("const", initConsts));
    }
    if (initVars.length > 0) {
        initStatements.push(b.variableDeclaration("let", initVars));
    }

    let iterateJs;
    let iterateOpts;
    switch (mode) {
    case "csv":
        iterateJs = "const {eachCsv, print} = require('.');\n";

        if (csvHeader) {
            iterateJs += "for await (const _ of eachCsv(process.stdin, {columns: true}))";
        } else {
            iterateJs += "for await (const $ of eachCsv(process.stdin))";
        }
        iterateJs += "{ LINE; }";
        break;

    case "json":
        iterateJs = `
            const {eachJson, print} = require(".");
            for await (const _ of eachJson(process.stdin, {filter: JSON_FILTER})) {
                LINE;
            }
        `;
        break;

    default:
        iterateJs = `
            const {eachLine, print} = require(".");
            for await (const _ of eachLine(process.stdin)) {
                LINE;
            }
        `;
        break;
    }

    const wrapper = parse(`
        (async function () {
            INIT;
            BEFORE;
            ${iterateJs}
            AFTER;
        })();
    `, {
        INIT: initStatements,
        BEFORE: beforeAst != null ? beforeAst.body : [],
        JSON_FILTER: jsonFilter != null ? b.literal(jsonFilter) : null,
        LINE: lineAst.body,
        AFTER: afterAst != null ? afterAst.body : [],
    });

    return escodegen.generate(wrapper);
}
