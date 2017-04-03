"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vr_reference_1 = require("./vr-reference");
const simple_logger_1 = require("../utils/simple-logger");
const node_iteration_1 = require("../utils/node-iteration");
const NAME = 'VR-DEEP_REFERENCE';
const Log = new simple_logger_1.default('vr-deep-reference');
/**
 * Resolve the references in nested objects
 */
class VrDeepRef {
    constructor(options) {
        this.name = NAME;
        this.pwd = options.pwd;
        this.vrReference = new vr_reference_1.default({ pwd: options.pwd });
    }
    resolve(value) {
        node_iteration_1.forEachLeaf(value, (leaf, mutate) => {
            if (this.vrReference.canResolve(leaf))
                mutate(this.vrReference.resolve(leaf));
            return false;
        });
        return value;
    }
    canResolve(value) {
        let canResolve = false;
        node_iteration_1.forEachLeaf(value, (leaf) => {
            return this.vrReference.canResolve(leaf);
        });
        return canResolve;
    }
}
exports.default = VrDeepRef;
//# sourceMappingURL=vr-deep-reference.js.map