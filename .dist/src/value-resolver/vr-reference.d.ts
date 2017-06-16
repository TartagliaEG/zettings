import { ValueResolver } from '../types';
/**
 * Load the module (or any sub property) specified by the "path" within the pattern "ref=path".
 * E.g: "ref=/path/to/module" -> loads the module pointed by the path.
 *
 * You could access the module sub-properties separating the path and the property name by the character "#"
 * E.g: "ref=/path/to/module#propName.anotherSubProp"
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
