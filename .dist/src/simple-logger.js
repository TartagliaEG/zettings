"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let level = 0;
function setLoggerLevel(lvl) {
    level = lvl;
}
exports.setLoggerLevel = setLoggerLevel;
exports.LVL_DEBUG = 0;
exports.LVL_INFO = 1;
exports.LVL_WARN = 2;
exports.LVL_ERROR = 3;
exports.LVL_NONE = 4;
class Logger {
    constructor(tag) {
        this.tag = tag;
    }
    d(...values) {
        if (level <= exports.LVL_DEBUG)
            console.log.apply(console, ['D - ' + this.tag + ': '].concat(values));
    }
    i(...values) {
        if (level <= exports.LVL_INFO)
            console.log.apply(console, ['I - ' + this.tag + ': '].concat(values));
    }
    w(...values) {
        if (level <= exports.LVL_WARN)
            console.log.apply(console, ['W - ' + this.tag + ': '].concat(values));
    }
    e(...values) {
        if (level <= exports.LVL_ERROR)
            console.log.apply(console, ['E - ' + this.tag + ': '].concat(values));
    }
}
exports.default = Logger;
//# sourceMappingURL=simple-logger.js.map