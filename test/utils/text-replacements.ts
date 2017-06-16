import { expect } from "chai";
import { safeReplace, toUppercase, replaceAll } from '../../src/utils/text-replacements';
import { setLoggerLevel, LVL_NONE } from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("TextReplacements", function () {
  describe('.safeReplace', function () {

    it("Assert that the replacement is global.", function () {
      const replace = [{ key: '__', replaceBy: '==' }];
      expect(safeReplace('test__test__', replace)).to.be.equals('test==test==');
    });

    it("Assert that the most specific replacement is done first.", function () {
      let replace = [
        { key: '__', replaceBy: '2' },
        { key: '_', replaceBy: '1' },
        { key: '___', replaceBy: '3' }
      ];

      expect(safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
    });

    it("Assert that the replacement items order doesn't matter.", function () {
      let replace = [{ key: '_', replaceBy: '1' }, { key: '__', replaceBy: '2' }, { key: '___', replaceBy: '3' }];
      expect(safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');

      replace = [{ key: '___', replaceBy: '3' }, { key: '_', replaceBy: '1' }, { key: '__', replaceBy: '2' }];
      expect(safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');

      replace = [{ key: '_', replaceBy: '1' }, { key: '___', replaceBy: '3' }, { key: '__', replaceBy: '2' }];
      expect(safeReplace('___|__|_|____|_____|______', replace)).to.be.equals('3|2|1|31|32|33');
    });

    it("Assert that invalid replacements throw errors", function () {
      expect(() => safeReplace('a', [{ replaceBy: undefined, key: 'a' }])).to.throw(Error);
      expect(() => safeReplace('a', [{ replaceBy: 'a', key: undefined }])).to.throw(Error);
      expect(() => safeReplace('a', [undefined])).to.throw(Error);
    })
  });

  describe('.toUppercase', function () {
    it("Assert that characters prefixed by the token will have its letter case changed.", function () {
      expect(toUppercase(['te_s_t'], '_')).to.be.deep.equals(['teST']);
    });

    it("Assert that tokens used as the last character works properly", function () {
      expect(toUppercase(['te_s_t_'], '_')).to.be.deep.equals(['teST']);
    });

    it("Assert that multiple keys could be changed at once", function () {
      expect(toUppercase(['_first', '_s_e_c_o_n_d'], '_')).to.be.deep.equals(['First', 'SECOND']);
    });

    it("Assert that multiples tokens in sequence are removed", function () {
      expect(toUppercase(['a___a___'], '_')).to.be.deep.equals(['aA']);
    });
  });

  describe('.toUppercase', function () {
    it("Assert that all the occurrences of token will be replaced", function () {
      expect(replaceAll('t|e||st', '|', '')).to.be.deep.equals(['test']);
    });

    it("Assert that all keys will have its valus replaced.", function () {
      expect(replaceAll(['|a|', 'a|a'], '|', '')).to.be.deep.equals(['a', 'aa']);
    })
  });
});
