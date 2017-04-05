import { Source } from '../zettings';
export interface Dependencies {
    toUppercase: (keys: string[], token: string) => string[];
    safeReplace: (text: string, replacements: {
        key: string;
        replaceBy: string;
    }[]) => string;
    deepAssign: (props: string[], value: any, root?: Object | Array<any>) => Object | Array<any>;
}
export default class EnvSource implements Source {
    readonly name: string;
    private readonly environmentCase;
    private readonly separatorToken;
    private readonly uppercaseToken;
    private readonly prefix;
    private readonly deps;
    constructor(options?: EnvOptions);
    get(keys: string[]): any;
    /**
     * Transform all environment variables that starts with the given key in an object.
     *
     * @param {string} key
     */
    private getAsObject(key);
    /**
     * Prefix all uppercase letters with the configured uppercaseToken.
     * @param {string[]} keys
     */
    private insertUppercaseToken(keys);
    /**
     * Change the key letter case to the environment variables letter case
     * @param {string[]} keys
     */
    private applyEnvironmentCase(keys);
}
export interface EnvOptions {
    name?: string;
    /**
     * Specifies in which letter case the environment variables are declared (so the #get method could change the keys letter case).
     **/
    environmentCase?: LetterCase;
    /**
     * Specifies a token to be used as a marker to uppercase letters.
     *
     * If all environment variables are being declared with the same letter case, this token could be used to mark capital letters.
     * For example, if the property 'uppercaseToken' was set to '_', the 'separatorToken' was set to  '__' and there is an environment
     * variable named 'SERVER__SETTINGS__MAIN_PORT', calling #get(['server']) will returns { settings: {mainPort: <value>} }.
     */
    uppercaseToken?: string;
    /** Specifies the key separator. Defaults to '__' **/
    separatorToken?: string;
    /** Specifies a prefix to be used in all keys. Defaults to '' **/
    prefix?: string;
    /** Optional function dependencies */
    dependencies?: Dependencies;
}
export declare type LetterCase = 'upper' | 'lower' | 'no_change';
