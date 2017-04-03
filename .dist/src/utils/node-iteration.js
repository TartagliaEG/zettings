"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_check_1 = require("./type-check");
const CIRCULAR_KEY = '___$CIRCULAR';
function forEachLeaf(node, onReachLeaf) {
    const circularRefs = [];
    _forEachLeaf([node], onReachLeaf, circularRefs);
    circularRefs.forEach((item) => { delete item[CIRCULAR_KEY]; });
}
exports.forEachLeaf = forEachLeaf;
function _forEachLeaf(node, onReachLeaf, circularRefs) {
    if (node[CIRCULAR_KEY])
        return;
    let keys = type_check_1.isArray(node) ? { length: node.length } : Object.keys(node);
    node[CIRCULAR_KEY] = true;
    circularRefs.push(node);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i] || i.toString();
        let shouldBreak;
        const value = node[key];
        if (type_check_1.isObject(value) || type_check_1.isArray(value))
            shouldBreak = _forEachLeaf(value, onReachLeaf, circularRefs);
        else
            shouldBreak = onReachLeaf(value, (newVal) => { node[key] = newVal; });
        if (shouldBreak)
            return true;
    }
    return false;
}
//# sourceMappingURL=node-iteration.js.map