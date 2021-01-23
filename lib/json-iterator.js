"use strict";

function streamToPromise (input) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        input.on("data", chunk => {
            chunks.push(chunk);
        });
        input.on("error", reject);
        input.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
    });
}

module.exports = function (input, {filter}) {
    const jq = require("jq-in-the-browser").default;
    const query = jq(filter);

    const promise = streamToPromise(input).then(buffer => {
        // This should maybe use a streaming JSON parser instead of buffering the entire stream
        if (buffer.length == 0) {
            return [];
        }
        const elements = query(JSON.parse(buffer));
        return Array.isArray(elements) ? elements : [elements];
    });

    return {
        [Symbol.asyncIterator]: () => {
            let n = 0;
            return {
                async next () {
                    const elements = await promise;
                    return n >= elements.length ? { done: true } : { value: elements[n++] };
                }
            };
        }
    }
};
