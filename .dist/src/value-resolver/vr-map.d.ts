import { ValueResolver } from '../types';
/**
 * This value resolver works as a simple map, so it will replace the key name by a pre configured value.
 * E.g:  "key=pwd" => "path/configured/on/zettings"
 * The "key=" is the pattern that this ValueResolver looks for, the remaining text is used as the map key.
 */
export default class VrMap implements ValueResolver {
    readonly name: string;
    readonly pattern: RegExp;
    readonly map: Map<string, any>;
    constructor(options: MapOptions);
    put(key: string, value: any): void;
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface MapOptions {
    map: Map<string, any>;
}
