import { ValueResolver } from '../types';
/**
 * Load the module (or any sub property) specified by the "path" within the pattern ${ref=path}.
 * E.g:  ${ref=/path/to/the/module} OR ${ref=/path/to/the/module#subProperty}
 */
export default class VrReference implements ValueResolver {
    readonly name: string;
    readonly pattern: RegExp;
    readonly pwd: string;
    constructor(options: RefOptions);
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface RefOptions {
    pwd: string;
}
