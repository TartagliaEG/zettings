import { ValueResolver } from '../zettings';
export default class VrReference implements ValueResolver {
    readonly name: string;
    readonly pattern: RegExp;
    readonly pwd: string;
    constructor(options: Options);
    resolve(value: any): any;
    canResolve(value: any): boolean;
}
export interface Options {
    pwd: string;
}
