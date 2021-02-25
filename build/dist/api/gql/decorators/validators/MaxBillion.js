"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxBillion = void 0;
const class_validator_1 = require("class-validator");
/**
 * Декоратор который ограничивает максимальное значение одним миллиардом.
 * @type {PropertyDecorator}
 */
exports.MaxBillion = class_validator_1.Max(Math.pow(10, 9));

//# sourceMappingURL=MaxBillion.js.map
