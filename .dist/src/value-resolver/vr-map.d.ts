import { ValueResolver } from '../zettings';
/**
 * This value resolver works as a simple map, so it will replace the value within the pattern ${key=value} by a pre configured value.
 * E.g:  "${key=pwd}" => "path/configured/on/zettings"
 */
export default class VrMap implements ValueResolver {
    readonly name: string;
    readonly pattern: RegExp;
    readonly map: Map<string, any>;
    constructor(options: Options);
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface Options {
    map: Map<string, any>;
}
