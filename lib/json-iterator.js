"use strict";

module.exports = function (input, {filter}) {
    const { Readable } = require("stream");
    const JSONStream = require("JSONStream");

    const parser = input.pipe(JSONStream.parse(filter));
    return new Readable({objectMode: true}).wrap(parser);
};
