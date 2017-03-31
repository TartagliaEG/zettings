"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Path = require("path");
const OS = require("os");
class JsonSource {
    constructor(options) {
        this.json = {};
        this.name = options.name || 'JSON';
        options.pwd = options.pwd === undefined ? '' : options.pwd;
        options.pwd = options.pwd === '$HOME' ? OS.homedir() : options.pwd;
        options.paths.forEach((path) => {
            try {
                _.merge(this.json, require(Path.join(options.pwd, path)));
            }
            catch (err) {
                console.error("No valid json found at '" + path + "'", err);
                throw err;
            }
        });
    }
    get(keys) {
        return _.get(this.json, keys);
    }
}
exports.default = JsonSource;
//# sourceMappingURL=src-json.js.map