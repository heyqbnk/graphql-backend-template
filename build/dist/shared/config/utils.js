"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppEnvironment = exports.getBoolean = exports.getString = exports.getNumber = exports.createError = void 0;
const utils_1 = require("~/shared/utils");
/**
 * Creates error for specified environment variable.
 * @param {string} envName
 * @returns {Error}
 */
function createError(envName) {
    return new Error(`Environment variable ${envName} was not passed or has incorrect format`);
}
exports.createError = createError;
/**
 * Parses variable as number.
 * @param {string} variableName
 * @param {IGetNumberOptions} options
 * @returns {number}
 */
function getNumber(variableName, options = {}) {
    const { defaultValue, type } = options;
    const value = Number(process.env[variableName]);
    if (Number.isNaN(value) ||
        (type === 'negative' && value >= 0) ||
        (type === 'positive' && value <= 0)) {
        if (utils_1.isUndefined(defaultValue)) {
            throw createError(variableName);
        }
        return defaultValue;
    }
    return value;
}
exports.getNumber = getNumber;
/**
 * Parses variable as string.
 * @param {string} variableName
 * @param {IGetStringOptions} options
 * @returns {string}
 */
function getString(variableName, options = {}) {
    const { defaultValue } = options;
    const value = process.env[variableName];
    if (utils_1.isString(value)) {
        return value;
    }
    if (utils_1.isString(defaultValue)) {
        return defaultValue;
    }
    throw createError(variableName);
}
exports.getString = getString;
/**
 * Parses variable as boolean.
 * @param variableName
 * @param options
 */
function getBoolean(variableName, options = {}) {
    const { defaultValue } = options;
    const value = process.env[variableName];
    if (utils_1.isString(value)) {
        return value === '1';
    }
    if (utils_1.isBoolean(defaultValue)) {
        return defaultValue;
    }
    throw createError(variableName);
}
exports.getBoolean = getBoolean;
/**
 * Parses variable as application environment.
 * @param {string} variableName
 * @param {IGetAppEnvironmentOptions} options
 * @returns {TAppEnvironment}
 */
function getAppEnvironment(variableName, options = {}) {
    const { defaultValue } = options;
    const value = process.env[variableName];
    if (utils_1.isString(value)) {
        if (['local', 'staging', 'production'].includes(value)) {
            return value;
        }
        throw createError(variableName);
    }
    if (utils_1.isString(defaultValue)) {
        return defaultValue;
    }
    throw createError(variableName);
}
exports.getAppEnvironment = getAppEnvironment;

//# sourceMappingURL=utils.js.map
