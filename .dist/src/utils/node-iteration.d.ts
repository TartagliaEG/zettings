import { primitive } from './types';
export declare function forEachLeaf(node: any, onReachLeaf: (leaf: primitive, mutate: (newValue: any) => void) => boolean): void;
export declare type OnReachLeaf = (leaf: primitive, mutate: (newValue: any) => void) => boolean;
