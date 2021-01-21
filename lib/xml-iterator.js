"use strict";

module.exports = function (input, {selector}) {
    const htmlIterator = require("./html-iterator");
    return htmlIterator(input, {selector, xmlMode: true});
};
