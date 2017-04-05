/**
 * Replaces the occurrences of 'key' in the given 'text' by 'replaceBy'. This function assures
 * that the replacements will be applied from the most specific to the least one.
 * @param {string} text - The text to be modified
 * @param {replacement[]} replacements - An array of replacements to be applied in the given text
 * @return {string} The modified text
 */
export declare function safeReplace(text: string, replacements: {
    key: string;
    replaceBy: string;
}[]): any;
/**
 * Replace characters following the 'ucaseToken' by its uppercase equivalent.
 * @param {string[]} keys - Array of keys
 * @param {string} token - The token that identifies what character should be replaced
 */
export declare function toUppercase(keys: string[], ucaseToken: string): string[];
export declare function replaceAll(text: string, token: string, replace: string): string[];
export declare function replaceAll(text: string[], token: string, replace: string): string[];
