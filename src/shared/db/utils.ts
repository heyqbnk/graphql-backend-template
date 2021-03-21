import {IPrimaryKey} from './shared';

/**
 * Removes primary key from document.
 */
export type TOmitPrimaryKey<T> = Omit<T, keyof IPrimaryKey>;