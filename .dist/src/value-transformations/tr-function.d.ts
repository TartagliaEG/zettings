import { ValueTransformation } from '../zettings';
export default class TrFunction implements ValueTransformation {
    readonly name: string;
    readonly pattern: RegExp;
    readonly pwd: string;
    constructor(options: Options);
    transform(value: any): any;
}
export interface Options {
    pwd: string;
}
