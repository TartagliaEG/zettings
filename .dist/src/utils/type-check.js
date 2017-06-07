"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isArray = Array.isArray;
exports.isArray = isArray;
function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
exports.isNumeric = isNumeric;
function isObject(value) {
    return typeof value === "object" && value !== null && !isArray(value);
}
exports.isObject = isObject;
function isPrimitive(value) {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean";
}
exports.isPrimitive = isPrimitive;
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
function isBoolean(value) {
    return typeof value === "boolean";
}
exports.isBoolean = isBoolean;
function isValid(value) {
    return value !== null && value !== undefined;
}
exports.isValid = isValid;
//# sourceMappingURL=type-check.js.map