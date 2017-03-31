"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class MemorySource {
    constructor(options) {
        this.json = {};
        options = options || {};
        this.name = options.name || 'JSON';
    }
    get(keys) {
        return _.get(this.json, keys);
    }
    set(keys, value) {
        _.set(this.json, keys, value);
    }
}
exports.default = MemorySource;
//# sourceMappingURL=src-memory.js.map