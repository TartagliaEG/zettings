"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_logger_1 = require("../utils/simple-logger");
const type_check_1 = require("../utils/type-check");
const Log = new simple_logger_1.default('src-env');
class EnvSource {
    constructor(options) {
        this.SEPARATOR_TEMP = "§§";
        this.SEPARATOR_REGX = /§§/;
        this.UPPERCASE_TEMP = "¬¬";
        this.UPPERCASE_REGX = /(?=¬¬)/;
        options = options || {};
        this.name = options.name || 'ENV';
        this.environmentCase = options.environmentCase || 'upper';
        this.separatorToken = options.separatorToken || '__';
        this.uppercaseToken = options.uppercaseToken;
        this.prefix = options.prefix;
    }
    get(keys) {
        if (this.prefix)
            keys = [this.prefix].concat(keys);
        let key = keys.join(this.separatorToken);
        key = this.applyUppercaseToken(key);
        key = this.applyEnvironmentCase(key);
        if (process.env[key] !== undefined)
            return process.env[key];
        return this.getAsObject(key);
    }
    getAsObject(key) {
        let result;
        Object.keys(process.env).forEach((envKey) => {
            const start = key + this.separatorToken;
            if (!envKey.startsWith(start))
                return;
            result = result || {};
            let remaining = envKey.replace(start, '');
            if (this.uppercaseToken) {
                if (this.separatorToken.indexOf(this.uppercaseToken) !== -1) {
                    remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
                    remaining = remaining.replace(this.uppercaseToken, this.UPPERCASE_TEMP);
                }
                else if (this.uppercaseToken.indexOf(this.separatorToken) !== -1) {
                    remaining = remaining.replace(this.uppercaseToken, this.UPPERCASE_TEMP);
                    remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
                }
            }
            else {
                remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
            }
            remaining = remaining.toLocaleLowerCase();
            if (this.environmentCase !== 'no_change') {
                let ucase = '';
                remaining.split(this.UPPERCASE_REGX).forEach((key) => {
                    if (!key.startsWith(this.UPPERCASE_TEMP))
                        return ucase += key;
                    const tempKey = key.replace(this.UPPERCASE_TEMP, '');
                    if (tempKey.length === 0) {
                        Log.w("The uppercase token is being used as the last character: " + envKey);
                        return;
                    }
                    ucase += tempKey.charAt(0).toUpperCase() + tempKey.slice(1);
                });
                remaining = ucase;
            }
            let currNode = result;
            remaining.split(this.SEPARATOR_REGX).forEach((key, idx, arr) => {
                if (key.length === 0)
                    return;
                currNode[key] = currNode[key] || type_check_1.isNumeric(key) ? [] : {};
                if (idx === arr.length - 1)
                    currNode[key] = process.env[envKey];
                currNode = currNode[key];
            });
        });
        return result;
    }
    applyUppercaseToken(key) {
        if (!this.uppercaseToken)
            return key;
        const ucase = /[A-Z]/;
        let newKey = '';
        key.split('').forEach((char) => {
            newKey += ucase.test(char) ? this.uppercaseToken + char : char;
            ;
        });
        return newKey;
    }
    applyEnvironmentCase(key) {
        if (this.environmentCase === 'upper')
            key = key.toUpperCase();
        else if (this.environmentCase === 'lower')
            key = key.toLowerCase();
        return key;
    }
}
exports.default = EnvSource;
//# sourceMappingURL=src-env.js.map