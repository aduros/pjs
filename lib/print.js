"use strict";

/** Print arguments, converting objects to JSON. */
module.exports = function (...messages) {
    messages = messages.map(o => (typeof o == "object") ? JSON.stringify(o, null, "  ") : o);
    process.stdout.write(messages.join(" ")+"\n");
}
