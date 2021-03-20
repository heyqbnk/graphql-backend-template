import {Max} from 'class-validator';

/**
 * Декоратор который ограничивает максимальное значение одним миллиардом.
 * @type {PropertyDecorator}
 */
export const MaxBillion = Max(Math.pow(10, 9));