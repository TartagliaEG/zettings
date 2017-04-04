"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'VR-MAP';
const Log = new simple_logger_1.default('vr-map');
/**
 * This value resolver works as a simple map, so it will replace the value within the pattern ${key=value} by a pre configured value.
 * E.g:  "${key=pwd}" => "path/configured/on/zettings"
 */
class VrMap {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^(\${key=)([^}]+)(})$/;
        this.map = options.map;
    }
    resolve(value) {
        // value#split results in ['', '${key=', '<content>', '}']
        const content = value.split(this.pattern)[2];
        return this.map.get(content);
    }
    canResolve(value) {
        // value#split results in ['', '${key=', '<content>', '}']
        if (!this.pattern.test(value))
            return false;
        const content = value.split(this.pattern)[2];
        return this.map.has(content);
    }
}
exports.default = VrMap;
//# sourceMappingURL=vr-map.js.map