"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'TR-FUNCTION';
const Log = new simple_logger_1.default('tr-function');
/**
 * Load the module (or any sub property) specified by the "path" within the pattern ${ref=path}.
 * E.g:  ${ref=/path/to/the/module} OR ${ref=/path/to/the/module#subProperty}
 */
class VrReference {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^(\${ref=)([^}]+)(})$/i;
        this.pwd = options.pwd;
    }
    resolve(value) {
        // value#split results in ['', '${ref=', '<content>', '}']
        const content = value.split(this.pattern)[2];
        let moduleProp = content.split('#')[1];
        let modulePath = content.split('#')[0];
        let module;
        try {
            if (/^[a-zA-Z]/.test(modulePath)) {
                module = require(modulePath);
                return !!moduleProp ? _.get(module, moduleProp) : module;
            }
        }
        catch (err) { }
        try {
            module = require(Path.join(this.pwd, modulePath));
            return !!moduleProp ? _.get(module, moduleProp) : module;
        }
        catch (err) {
            Log.e('Faile to load the file pointed by the path "' + modulePath + '"');
            throw err;
        }
    }
    canResolve(value) {
        return this.pattern.test(value);
    }
}
exports.default = VrReference;
//# sourceMappingURL=vr-reference.js.map