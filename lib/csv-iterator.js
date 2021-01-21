"use strict";

module.exports = function (input, {columns} = {}) {
    const csvParse = require("csv-parse");
    return input.pipe(csvParse({columns}));
};
