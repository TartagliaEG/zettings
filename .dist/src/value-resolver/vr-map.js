"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'VR-MAP';
const Log = new simple_logger_1.default('vr-map');
/**
 * This value resolver works as a simple map, so it will replace the key name by a pre configured value.
 * E.g:  "key=pwd" => "path/configured/on/zettings"
 */
class VrMap {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^key=/;
        this.map = options.map;
    }
    put(key, value) {
        this.map.set(key, value);
    }
    resolve(value) {
        // value#split results in ['', 'key=', '<keyName>']
        const keyName = value.trim().split(this.pattern)[1];
        return this.map.get(keyName);
    }
    canResolve(value) {
        // value#split results in ['', 'key=', '<keyName>']
        if (!this.pattern.test(value))
            return false;
        const keyName = value.trim().split(this.pattern)[1];
        return this.map.has(keyName);
    }
}
exports.default = VrMap;
//# sourceMappingURL=vr-map.js.map