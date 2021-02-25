/**
 * Creates throwable error class.
 * @param {string} name
 * @param {string} defaultMessage
 * @returns {{new(message?: string): {name: string, message: string, stack?: string}, (message?: string): Error, readonly prototype: Error}}
 */
export function createError(name: string, defaultMessage: string) {
  return class extends Error {
    constructor(message?: string) {
      super(message || defaultMessage);
      this.name = name;
    }
  };
}