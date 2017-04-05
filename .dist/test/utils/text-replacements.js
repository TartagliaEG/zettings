"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const text_replacements_1 = require("../../src/utils/text-replacements");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("TextReplacements", function () {
    describe('.safeReplace', function () {
        it("Assert that the replacement is global.", function () {
            const replace = [{ key: '__', replaceBy: '==' }];
            chai_1.expect(text_replacements_1.safeReplace('test__test__', replace)).to.be.equals('test==test==');
        });
        it("Assert that the most specific replacement is done first.", function () {
            let replace = [
                { key: '__', replaceBy: '2' },
                { key: '_', replaceBy: '1' },
                { key: '___', replaceBy: '3' }
            ];
            chai_1.expect(text_replacements_1.safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
        });
        it("Assert that the replacement items order doesn't matter.", function () {
            let replace = [{ key: '_', replaceBy: '1' }, { key: '__', replaceBy: '2' }, { key: '___', replaceBy: '3' }];
            chai_1.expect(text_replacements_1.safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
            replace = [{ key: '___', replaceBy: '3' }, { key: '_', replaceBy: '1' }, { key: '__', replaceBy: '2' }];
            chai_1.expect(text_replacements_1.safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
            replace = [{ key: '_', replaceBy: '1' }, { key: '___', replaceBy: '3' }, { key: '__', replaceBy: '2' }];
            chai_1.expect(text_replacements_1.safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
        });
        it("Assert that invalid replacements throw errors", function () {
            chai_1.expect(() => text_replacements_1.safeReplace('a', [{ replaceBy: undefined, key: 'a' }])).to.throw(Error);
            chai_1.expect(() => text_replacements_1.safeReplace('a', [{ replaceBy: 'a', key: undefined }])).to.throw(Error);
            chai_1.expect(() => text_replacements_1.safeReplace('a', [undefined])).to.throw(Error);
        });
    });
    describe('.toUppercase', function () {
        it("Assert that characters prefixed by the token will have its letter case changed.", function () {
            chai_1.expect(text_replacements_1.toUppercase(['te_s_t'], '_')).to.be.deep.equals(['teST']);
        });
        it("Assert that tokens used as the last character works properly", function () {
            chai_1.expect(text_replacements_1.toUppercase(['te_s_t_'], '_')).to.be.deep.equals(['teST']);
        });
        it("Assert that multiple keys could be changed at once", function () {
            chai_1.expect(text_replacements_1.toUppercase(['_first', '_s_e_c_o_n_d'], '_')).to.be.deep.equals(['First', 'SECOND']);
        });
        it("Assert that multiples tokens in sequence are removed", function () {
            chai_1.expect(text_replacements_1.toUppercase(['a___a___'], '_')).to.be.deep.equals(['aA']);
        });
    });
    describe('.toUppercase', function () {
        it("Assert that all the occurrences of token will be replaced", function () {
            chai_1.expect(text_replacements_1.replaceAll('t|e||st', '|', '')).to.be.deep.equals(['test']);
        });
        it("Assert that all keys will have its valus replaced.", function () {
            chai_1.expect(text_replacements_1.replaceAll(['|a|', 'a|a'], '|', '')).to.be.deep.equals(['a', 'aa']);
        });
    });
});
//# sourceMappingURL=text-replacements.js.map