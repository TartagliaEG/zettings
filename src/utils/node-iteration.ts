import * as _ from 'lodash';

import { primitive, isObject, isArray, isNumeric, StrIndexed } from './type-check';

const CIRCULAR_KEY = '___$CIRCULAR';

export type IterationFlag = 'CONTINUE_ITERATION' | 'BREAK_ITERATION';

/**
 * The function called when a leaf is reached.
 * @param {primitive} leaf - The leaf value
 * @param {function} mutate - A that allows the leaf mutation.
 * @returns {boolean} - Return true to stop the iteration or false to continue.
 */
export type OnReachLeaf = (leaf: primitive, mutate: (newValue: any) => void) => IterationFlag;


/**
 * Iterates over the given node and call the onReachLeaf fuction on each leaf.
 *
 * @param {any} node - The root node to start looking for leafs. The node itself can be a leaf.
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @see {OnReachLeaf} Return true to stop the iteration
 */
export function forEachLeaf(node: any, onReachLeaf: OnReachLeaf): void {
  const circularRefs: any[] = [];
  _forEachLeaf([node], onReachLeaf, circularRefs);
  circularRefs.forEach((item) => { delete item[CIRCULAR_KEY]; });
}


/**
 * Do a deep iteration in objects and arrays and call the onReachLeaf function on each leaf.
 *
 * @param {Array|Object} node - The array or object to iterate over
 * @param {OnReachLeaf} onReachLeaf - The function called when the leaf is reached.
 * @param {Array} circularRefs - An array to push all circular references into.
 */
function _forEachLeaf(node: StrIndexed, onReachLeaf: OnReachLeaf, circularRefs: Array<any>): boolean {
  if (node[CIRCULAR_KEY])
    return false;

  let keys: { length: number, [key: string]: any } = isArray(node) ? { length: node.length } : Object.keys(node);

  node[CIRCULAR_KEY] = true;
  circularRefs.push(node);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i.toString()] || i.toString();
    let shouldBreak: boolean;
    const value = node[key];

    if (isObject(value) || isArray(value))
      shouldBreak = _forEachLeaf(value, onReachLeaf, circularRefs);
    else
      shouldBreak = onReachLeaf(value, (newVal: any) => { node[key] = newVal }) === 'BREAK_ITERATION';

    if (shouldBreak)
      return true;
  }

  return false;
}

/**
 * Transform the keys in a nested object or array containing the value parâmeter.
 */
export function toLeaf(keys: string[], value: any, root?: any): Object {
  if (keys.length === 0)
    throw new Error("Can't convert an empty key list to a node leaf");

  root = root || (isNumeric(keys[0]) ? [] : {});
  return _.set(root, keys, value);
}
