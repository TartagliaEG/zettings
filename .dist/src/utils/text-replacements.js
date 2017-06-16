"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_logger_1 = require("./simple-logger");
const Log = new simple_logger_1.default('safe-replace');
/**
 * Replaces the occurrences of 'key' in the given 'text' by 'replaceBy'. This function assures
 * that the replacements will be applied from the most specific to the least one.
 * @param {string} text - The text to be modified
 * @param {replacement[]} replacements - An array of replacements to be applied in the given text
 * @return {string} The modified text
 */
function safeReplace(text, replacements) {
    return _safeReplace(text, replacements);
}
exports.safeReplace = safeReplace;
function _safeReplace(text, replacements) {
    replacements.forEach((outerRep) => {
        if (outerRep.used)
            return;
        replacements.forEach((innerRep) => {
            if (!innerRep || typeof innerRep.replaceBy !== 'string' || typeof innerRep.key !== 'string') {
                Log.e("Invalid replacement", innerRep);
                throw new Error("Invalid replacement");
            }
            if (outerRep.key === innerRep.key || innerRep.used)
                return;
            else if (outerRep.key.indexOf(innerRep.key) >= 0)
                innerRep.skipThisRound = true;
            else if (innerRep.key.indexOf(outerRep.key) >= 0)
                outerRep.skipThisRound = true;
        });
    });
    let hasUnusedRep = false;
    replacements.forEach((replacement) => {
        if (replacement.skipThisRound || replacement.used) {
            // Since this token won't be used anymore in this round, we could set the skipThisRound flag to false
            replacement.skipThisRound = false;
            hasUnusedRep = hasUnusedRep || !replacement.used;
            return;
        }
        text = replaceAll(text, replacement.key, replacement.replaceBy)[0];
        replacement.used = true;
    });
    if (hasUnusedRep)
        return _safeReplace(text, replacements);
    else
        return text;
}
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
/**
 * Replace the characters prefixed with the given 'ucaseToken' by its uppercase equivalent.
 * @param {string[]} keys - Array of keys
 * @param {string} token - The token that identifies what character should be replaced
 */
function toUppercase(keys, ucaseToken) {
    const regex = new RegExp('(?=' + escapeRegExp(ucaseToken) + ')');
    const keysCopy = keys.slice();
    for (let i = 0; i < keysCopy.length; i++) {
        if (keysCopy[i].indexOf(ucaseToken) === -1)
            continue;
        const ucaseArr = keysCopy[i].split(regex);
        let newKey = "";
        for (let j = 0; j < ucaseArr.length; j++) {
            let key = ucaseArr[j];
            if (!key.startsWith(ucaseToken)) {
                newKey += key;
                continue;
            }
            key = key.replace(ucaseToken, '');
            if (key.length === 0)
                Log.w("The keys ", keysCopy, "is using the uppercase token as its last character. ");
            newKey += key.charAt(0).toUpperCase() + key.slice(1);
        }
        keysCopy[i] = newKey;
    }
    return keysCopy;
}
exports.toUppercase = toUppercase;
/**
 * Replace all occurrence of the 'token' in the given 'keys' by the 'replaceBy' value.
 * @param {string|string[]} keys - List of keys
 * @param {string} token - The token to be replaced by
 * @param {string} replaceBy - The value to be replaced to
 */
function replaceAll(keys, token, replaceBy) {
    keys = Array.isArray(keys) ? keys : [keys];
    const keysCopy = keys.slice();
    const regex = new RegExp(escapeRegExp(token), 'g');
    for (let i = 0; i < keysCopy.length; i++) {
        keysCopy[i] = keysCopy[i].replace(regex, replaceBy);
    }
    return keysCopy;
}
exports.replaceAll = replaceAll;
//# sourceMappingURL=text-replacements.js.map