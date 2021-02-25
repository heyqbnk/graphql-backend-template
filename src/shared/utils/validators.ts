/**
 * States that value is map.
 * @param value
 * @returns {value is Record<string, unknown>}
 */
export function isObject(value: any): value is Record<string, unknown> {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

/**
 * States that value is boolean.
 * @param value
 * @returns {value is boolean}
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * States that value is string.
 * @param value
 * @returns {value is string}
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * States that value is number.
 * @param value
 * @returns {value is number}
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

/**
 * States that value is undefined.
 * @param value
 * @returns {value is undefined}
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

/**
 * States that value is array.
 * @param value
 * @returns {value is Array<unknown>}
 */
export function isArray(value: any): value is Array<unknown> {
  return Array.isArray(value);
}
