"use strict";

module.exports = function (input, {filter}) {
    const { Readable } = require("stream");
    const JSONStream = require("JSONStream");

    const parser = process.stdin.pipe(JSONStream.parse(filter));
    return new Readable({objectMode: true}).wrap(parser);
};
