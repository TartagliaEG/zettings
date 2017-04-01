import { Source } from '../zettings';
export default class EnvSource implements Source {
    readonly name: string;
    private readonly letterCase;
    private readonly separator;
    private readonly prefix;
    constructor(options?: EnvOptions);
    get(keys: string[]): any;
}
export interface EnvOptions {
    name?: string;
    letterCase?: LetterCase;
    separator?: string;
    prefix?: string;
}
export declare type LetterCase = 'upper' | 'lower' | 'normal';
