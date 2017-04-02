"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNumeric(value) {
    return !isNaN(value) && isFinite(value);
}
exports.isNumeric = isNumeric;
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
exports.isObject = isObject;
//# sourceMappingURL=type-check.js.map