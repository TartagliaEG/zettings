import { primitive } from './types';
/**
 * Iterates over the given node and call the onReachLeaf fuction on each leaf.
 *
 * @param {any} node - The root node to start looking for leafs. The node itself could be a node.
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 */
export declare function forEachLeaf(node: any, onReachLeaf: (leaf: primitive, mutate: (newValue: any) => void) => boolean): void;
/**
 * The function called when a leaf is reached.
 * @param {primitive} leaf - The leaf value
 * @param {function} mutate - A that allows the leaf mutation.
 * @returns {boolean} - Return true to stop the iteration or false to continue.
 */
export declare type OnReachLeaf = (leaf: primitive, mutate: (newValue: any) => void) => boolean;
