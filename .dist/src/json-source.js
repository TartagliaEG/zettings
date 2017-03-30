"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class JsonSource {
    constructor(options) {
        this.json = {};
        this.name = options.name || 'JSON';
        options.paths.forEach((path) => {
            try {
                _.merge(this.json, require(path));
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
exports.JsonSource = JsonSource;
//# sourceMappingURL=json-source.js.map