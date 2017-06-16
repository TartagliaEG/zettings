"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'VR-REFERENCE';
const Log = new simple_logger_1.default('vr-reference');
/**
 * Load the module (or any sub property) specified by the "path" within the pattern "ref=path".
 * E.g: "ref=/path/to/module" -> loads the module pointed by the path.
 *
 * You could access the module sub-properties separating the path and the property name by the character "#"
 * E.g: "ref=/path/to/module#propName.anotherSubProp"
 */
class VrReference {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^ref=/i;
        this.pwd = options.pwd;
    }
    resolve(value) {
        const content = value.split(this.pattern)[1];
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