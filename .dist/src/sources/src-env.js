"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_logger_1 = require("../utils/simple-logger");
const text_replacements_1 = require("../utils/text-replacements");
const node_iteration_1 = require("../utils/node-iteration");
const Log = new simple_logger_1.default('src-env');
const SEPARATOR_TEMP = "§§";
const UPPERCASE_TEMP = "¬¬";
class EnvSource {
    constructor(options) {
        options = options || {};
        this.name = options.name || 'ENV';
        this.environmentCase = options.environmentCase || 'upper';
        this.separatorToken = options.separatorToken || '__';
        this.uppercaseToken = options.uppercaseToken;
        this.prefix = options.prefix;
        if (this.environmentCase === "no_change" && options.uppercaseToken)
            throw Error("Conflicting configuration. You can't set an uppercaseToken altogether with 'no_change' environmentCase. Configuring the uppercaseToken means that any occurrence of the given token should be used to modify the provided keys, and configuring the environmentCase as 'no_change' means that the keys should be used without changes.");
        if (this.separatorToken === this.uppercaseToken)
            throw new Error("You can't configure two different tokens with the same value - {" +
                "separatorToken: " + this.separatorToken + ", " +
                "uppercaseToken: " + this.uppercaseToken + "}");
    }
    get(keys) {
        keys = [].concat(keys); // clone
        if (this.prefix)
            keys = [this.prefix].concat(keys);
        this.insertUppercaseToken(keys);
        this.applyEnvironmentCase(keys);
        const key = keys.join(this.separatorToken);
        if (process.env[key] !== undefined)
            return process.env[key];
        return this.getAsObject(key);
    }
    /**
     * Transform all environment variables that starts with the given key in an object.
     *
     * @param {string} key
     */
    getAsObject(key) {
        let result;
        const allEnvKeys = Object.keys(process.env);
        for (let i = 0; i < allEnvKeys.length; i++) {
            const envKey = allEnvKeys[i];
            const start = key + this.separatorToken;
            if (!envKey.startsWith(start))
                continue;
            let remaining = envKey.replace(start, '');
            if (this.environmentCase !== 'no_change')
                remaining = remaining.toLowerCase();
            const replacements = [{ key: this.separatorToken, replaceBy: SEPARATOR_TEMP }];
            if (this.uppercaseToken)
                replacements.push({ key: this.uppercaseToken, replaceBy: UPPERCASE_TEMP });
            remaining = text_replacements_1.safeReplace(remaining, replacements);
            let objKeys = remaining.split(SEPARATOR_TEMP);
            objKeys = this.uppercaseToken ? text_replacements_1.toUppercase(objKeys, UPPERCASE_TEMP) : objKeys;
            result = node_iteration_1.toLeaf(objKeys, process.env[envKey], result);
        }
        ;
        return result;
    }
    /**
     * Prefix all uppercase letters with the configured uppercaseToken.
     * @param {string[]} keys
     */
    insertUppercaseToken(keys) {
        if (!this.uppercaseToken)
            return;
        const ucase = /[A-Z]/;
        for (let i = 0; i < keys.length; i++) {
            let newKey = '';
            keys[i].split('').forEach((char) => {
                newKey += ucase.test(char) ? this.uppercaseToken + char : char;
                ;
            });
            keys[i] = newKey;
        }
    }
    /**
     * Change the key letter case to the environment variables letter case
     * @param {string[]} keys
     */
    applyEnvironmentCase(keys) {
        for (let i = 0; i < keys.length; i++) {
            if (this.environmentCase === 'upper')
                keys[i] = keys[i].toUpperCase();
            else if (this.environmentCase === 'lower')
                keys[i] = keys[i].toLowerCase();
        }
    }
}
exports.default = EnvSource;
//# sourceMappingURL=src-env.js.map