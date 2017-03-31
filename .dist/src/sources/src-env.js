"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvSource {
    constructor(options) {
        options = options || {};
        this.name = options.name || 'ENV';
        this.letterCase = options.letterCase || 'upper';
        this.separator = options.separator || '_';
        this.prefix = options.prefix;
    }
    get(keys) {
        if (this.prefix)
            keys = [this.prefix].concat(keys);
        let key = keys.join(this.separator);
        if (this.letterCase == 'upper')
            key = key.toUpperCase();
        if (this.letterCase == 'lower')
            key = key.toLowerCase();
        return process.env[key];
    }
}
exports.default = EnvSource;
//# sourceMappingURL=src-env.js.map