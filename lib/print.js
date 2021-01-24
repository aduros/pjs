"use strict";

module.exports = function (msg) {
    if (typeof msg == "object") {
        msg = JSON.stringify(msg, null, "  ");
    }
    process.stdout.write(msg+"\n");
}
