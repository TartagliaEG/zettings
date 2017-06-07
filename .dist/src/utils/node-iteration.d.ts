import { primitive } from './types';
export declare type IterationFlag = 'CONTINUE_ITERATION' | 'BREAK_ITERATION';
/**
 * The function called when a leaf is reached.
 * @param {primitive} leaf - The leaf value
 * @param {function} mutate - A that allows the leaf mutation.
 * @returns {boolean} - Return true to stop the iteration or false to continue.
 */
export declare type OnReachLeaf = (leaf: primitive, mutate: (newValue: any) => void) => IterationFlag;
/**
 * Iterates over the given node and call the onReachLeaf fuction on each leaf.
 *
 * @param {any} node - The root node to start looking for leafs. The node itself can be a leaf.
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @see {OnReachLeaf} Return true to stop the iteration
 */
export declare function forEachLeaf(node: any, onReachLeaf: OnReachLeaf): void;
/**
 * Transform the keys in a nested object or array containing the value parâmeter.
 */
export declare function toLeaf(keys: string[], value: any, root?: any): Object;
