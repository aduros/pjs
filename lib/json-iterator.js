"use strict";

module.exports = function (input, {filter}) {
    const jq = require("jq-in-the-browser").default;
    const query = jq(filter);

    const JSONStream = require("JSONStream");
    const parser = JSONStream.parse();

    const { Transform } = require("stream");
    const extractor = new Transform({
        objectMode: true,

        transform (object, encoding, callback) {
            const elements = query(object);
            if (Array.isArray(elements)) {
                for (const element of elements) {
                    this.push(element);
                }
            } else {
                this.push(elements);
            }
            callback();
        },
    });

    parser.on("error", function (error) {
        extractor.emit("error", error);
    });

    return input.pipe(parser).pipe(extractor);
};
