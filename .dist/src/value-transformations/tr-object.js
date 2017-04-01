"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
const simple_logger_1 = require("../utils/simple-logger");
const NAME = 'TR-FUNCTION';
const Log = new simple_logger_1.default('tr-function');
class TrObject {
    constructor(options) {
        this.name = NAME;
        this.pattern = /^(\${obj=)([^}]+)(})$/i;
        this.pwd = options.pwd;
    }
    transform(value) {
        const content = value.split(this.pattern)[2];
        let moduleProp = content.split('#')[1];
        let modulePath = content.split('#')[0];
        let module;
        try {
            module = require(Path.join(this.pwd, modulePath));
        }
        catch (err) {
            Log.e('Faile to load the module pointed by the path "' + modulePath + '"');
            throw err;
        }
        return !!moduleProp ? _.get(module, moduleProp) : module;
    }
}
exports.default = TrObject;
//# sourceMappingURL=tr-object.js.map