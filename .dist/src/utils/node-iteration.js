"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const type_check_1 = require("./type-check");
const CIRCULAR_KEY = '___$CIRCULAR';
/**
 * Iterates over the given node and call the onReachLeaf fuction on each leaf.
 *
 * @param {any} node - The root node to start looking for leafs. The node itself could be a node.
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @see {OnReachLeaf} Return true to stop the iteration
 */
function forEachLeaf(node, onReachLeaf) {
    const circularRefs = [];
    _forEachLeaf([node], onReachLeaf, circularRefs);
    circularRefs.forEach((item) => { delete item[CIRCULAR_KEY]; });
}
exports.forEachLeaf = forEachLeaf;
/**
 * Do a deep iteration in objects and arrays and call the onReachLeaf function on each leaf.
 *
 * @param {Array|Object} node - The array or object to iterate over
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @param {Array} circularRefs - An array to push all circular references into.
 */
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
/**
 * Transform the keys in a nested object or array containing the value parâmeter.
 */
function toLeaf(keys, value, root) {
    if (keys.length === 0)
        throw new Error("Can't convert an empty key list to a node leaf");
    root = root || (type_check_1.isNumeric(keys[0]) ? [] : {});
    return _.set(root, keys, value);
}
exports.toLeaf = toLeaf;
//# sourceMappingURL=node-iteration.js.map