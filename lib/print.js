"use strict";

module.exports = function (msg) {
    if (typeof msg == "object") {
        msg = JSON.stringify(msg);
    }
    process.stdout.write(msg+"\n");
}
