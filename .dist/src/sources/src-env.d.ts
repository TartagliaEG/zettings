import { Source } from '../zettings';
export default class EnvSource implements Source {
    readonly name: string;
    private readonly environmentCase;
    private readonly separatorToken;
    private readonly uppercaseToken;
    private readonly prefix;
    private readonly SEPARATOR_TEMP;
    private readonly SEPARATOR_REGX;
    private readonly UPPERCASE_TEMP;
    private readonly UPPERCASE_REGX;
    constructor(options?: EnvOptions);
    get(keys: string[]): any;
    private getAsObject(key);
    private applyUppercaseToken(key);
    private applyEnvironmentCase(key);
}
export interface EnvOptions {
    name?: string;
    environmentCase?: LetterCase;
    uppercaseToken?: string;
    separatorToken?: string;
    prefix?: string;
}
export declare type LetterCase = 'upper' | 'lower' | 'no_change';
