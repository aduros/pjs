"use strict";

module.exports = function (input, {columns} = {}) {
    const csvParse = require("csv-parse");
    return process.stdin.pipe(csvParse({columns}));
};
