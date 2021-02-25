"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
/**
 * Creates throwable error class.
 * @param {string} name
 * @param {string} defaultMessage
 * @returns {{new(message?: string): {name: string, message: string, stack?: string}, (message?: string): Error, readonly prototype: Error}}
 */
function createError(name, defaultMessage) {
    return class extends Error {
        constructor(message) {
            super(message || defaultMessage);
            this.name = name;
        }
    };
}
exports.createError = createError;

//# sourceMappingURL=errors.js.map
