"use strict";

module.exports = function (input, {selector, xmlMode}) {
    const { DomHandler } = require("domhandler");
    const { WritableStream } = require("htmlparser2/lib/WritableStream");
    const cssSelect = require("css-select");

    function toObject (node) {
        const obj = {
            type: node.type,
            get text () {
                const { getText } = require("domutils");
                return getText(this);
            },
            get innerHTML () {
                const { getInnerHTML } = require("domutils");
                return getInnerHTML(this);
            },
            querySelector (selector) {
                return toObject(cssSelect.selectOne(selector, node, {xmlMode}));
            },
            querySelectorAll (selector) {
                return cssSelect.selectAll(selector, node, {xmlMode}).map(toObject);
            },
        };
        if (node.name != null) {
            obj.name = node.name;
        }
        if (node.data != null) {
            obj.data = node.data;
        }
        if (node.attribs != null) {
            obj.attr = node.attribs;
        }
        if (node.children != null) {
            obj.children = node.children.map(toObject);
        }
        return obj;
    }

    const promise = new Promise((resolve, reject) => {
        const handler = new DomHandler((err, dom) => {
            if (err != null) {
                reject(err);
            } else {
                const nodes = cssSelect.selectAll(selector, dom, {xmlMode});
                resolve(nodes.map(toObject));
            }
        });

        const writable = new WritableStream(handler, { xmlMode });
        input.pipe(writable);
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
