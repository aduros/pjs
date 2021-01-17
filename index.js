"use strict";

module.exports = {
    generate: require("./lib/generate"),
    print: require("./lib/print"),
    eachLine: require("./lib/line-iterator"),
    eachCsv: require("./lib/csv-iterator"),
    eachJson: require("./lib/json-iterator"),
};
