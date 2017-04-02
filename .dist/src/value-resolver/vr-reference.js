"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'TR-FUNCTION';
const Log = new simple_logger_1.default('tr-function');
class VrReference {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^(\${ref=)([^}]+)(})$/i;
        this.pwd = options.pwd;
    }
    resolve(value) {
        const content = value.split(this.pattern)[2];
        let moduleProp = content.split('#')[1];
        let modulePath = content.split('#')[0];
        let module;
        try {
            module = require(Path.join(this.pwd, modulePath));
        }
        catch (err) {
            Log.e('Faile to load the file pointed by the path "' + modulePath + '"');
            throw err;
        }
        return !!moduleProp ? _.get(module, moduleProp) : module;
    }
    canResolve(value) {
        return this.pattern.test(value);
    }
}
exports.default = VrReference;
//# sourceMappingURL=vr-reference.js.map