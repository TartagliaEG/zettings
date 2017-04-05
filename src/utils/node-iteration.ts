import {primitive} from './types';
import {isObject, isArray} from './type-check';
const CIRCULAR_KEY = '___$CIRCULAR';

/**
 * Iterates over the given node and call the onReachLeaf fuction on each leaf.
 *
 * @param {any} node - The root node to start looking for leafs. The node itself could be a node.
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 */
export function forEachLeaf(node: any, onReachLeaf: (leaf: primitive, mutate: (newValue: any) => void) => boolean): void {
  const circularRefs = [];
  _forEachLeaf([node], onReachLeaf, circularRefs);
  circularRefs.forEach((item) => {delete item[CIRCULAR_KEY];});
}

/**
 * The function called when a leaf is reached.
 * @param {primitive} leaf - The leaf value
 * @param {function} mutate - A that allows the leaf mutation.
 * @returns {boolean} - Return true to stop the iteration or false to continue.
 */
export type OnReachLeaf = (leaf: primitive, mutate: (newValue: any) => void) => boolean;

/**
 * Do a deep iteration in objects and arrays and call the onReachLeaf function on each leaf.
 *
 * @param {Array|Object} node - The array or object to iterate over
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @param {Array} circularRefs - An array to push all circular references into.
 */
function _forEachLeaf(node: Array<any>|Object, onReachLeaf: OnReachLeaf, circularRefs: Array<any>): boolean {
  if(node[CIRCULAR_KEY])
    return;

  let keys = isArray(node) ? {length: node.length} : Object.keys(node);

  node[CIRCULAR_KEY] = true;
  circularRefs.push(node);

  for(let i = 0; i < keys.length; i++) {
    let key = keys[i] || i.toString();
    let shouldBreak: boolean;
    const value = node[key];

    if(isObject(value) || isArray(value))
      shouldBreak = _forEachLeaf(value, onReachLeaf, circularRefs);
    else
      shouldBreak = onReachLeaf(value, (newVal: any) => {node[key] = newVal});

    if(shouldBreak)
      return true;
  }

  return false;
}

import {isNumeric} from './type-check';

export function toLeaf(keys: string[], value: any, root?: any): Object {
  if(keys.length === 0)
    throw new Error("Can't convert an empty key list to a node leaf");

  root = root || (isNumeric(keys[0]) ? [] : {});
  let current = root;
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const next = keys[i+1];

    if(next === undefined) {
      current[key] = value;
      break;
    }

    current[key] = current[key] || (isNumeric(next) ? [] : {});
    current = current[key]
  }
  return root;
}
