import { ValueResolver } from '../zettings';
import ReferenceResolver from './vr-reference';
/**
 * Resolve the references in nested objects
 */
export default class VrDeepRef implements ValueResolver {
    readonly name: string;
    readonly pwd: string;
    readonly vrReference: ReferenceResolver;
    constructor(options: Options);
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface Options {
    pwd: string;
}
