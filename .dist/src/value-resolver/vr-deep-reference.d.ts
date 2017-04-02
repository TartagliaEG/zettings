import { ValueResolver } from '../zettings';
import ReferenceResolver from './vr-reference';
export default class VrZettings implements ValueResolver {
    readonly name: string;
    readonly pwd: string;
    readonly vrreference: ReferenceResolver;
    constructor(options: Options);
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface Options {
    pwd: string;
}
