"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
class FunctionValue {
    constructor(options) {
        this.name = "FunctionTrasnformation";
        this.pattern = /^(\${fn=)([^}]+)(})$/i;
        this.pwd = options.pwd;
    }
    transform(value) {
        const content = value.split(this.pattern)[2];
        if (content.indexOf('#') < 0)
            throw new Error('Invalid function name. Expected "[path_to_module]#[function_name]" but found "' + content + '"');
        const dir = content.split('#')[0];
        const funct = content.split('#')[1];
        const mod = require(Path.join(this.pwd, dir));
        return _.get(mod, funct)(value);
    }
}
exports.default = FunctionValue;
//# sourceMappingURL=function-value.js.map