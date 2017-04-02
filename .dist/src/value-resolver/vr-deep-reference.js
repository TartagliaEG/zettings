"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vr_reference_1 = require("./vr-reference");
const simple_logger_1 = require("../utils/simple-logger");
const node_iteration_1 = require("../utils/node-iteration");
const NAME = 'TR-FUNCTION';
const Log = new simple_logger_1.default('tr-function');
class VrZettings {
    constructor(options) {
        this.name = NAME;
        this.pwd = options.pwd;
        this.vrreference = new vr_reference_1.default({ pwd: options.pwd });
    }
    resolve(value) {
        node_iteration_1.forEachLeaf(value, (leaf, mutate) => {
            if (this.vrreference.canResolve(leaf))
                mutate(this.vrreference.resolve(leaf));
            return false;
        });
    }
    canResolve(value) {
        let canResolve = false;
        node_iteration_1.forEachLeaf(value, (leaf) => {
            return this.vrreference.canResolve(leaf);
        });
        return canResolve;
    }
}
exports.default = VrZettings;
//# sourceMappingURL=vr-deep-reference.js.map