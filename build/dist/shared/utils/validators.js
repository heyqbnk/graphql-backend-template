"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = exports.isUndefined = exports.isNumber = exports.isString = exports.isBoolean = exports.isObject = void 0;
/**
 * States that value is map.
 * @param value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
exports.isObject = isObject;
/**
 * States that value is boolean.
 * @param value
 * @returns {value is boolean}
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * States that value is string.
 * @param value
 * @returns {value is string}
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * States that value is number.
 * @param value
 * @returns {value is number}
 */
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
/**
 * States that value is undefined.
 * @param value
 * @returns {value is undefined}
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * States that value is array.
 * @param value
 * @returns {value is Array<unknown>}
 */
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;

//# sourceMappingURL=validators.js.map
