"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_env_1 = require("../../src/sources/src-env");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("EnvSource", function () {
    it("Assert that, by default, keys are joined by two underscores and toUpperCase is called.", function () {
        const env = new src_env_1.default();
        process.env.TEST__KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST__KEY;
    });
    it("Assert that changing the key separator has the expected effect.", function () {
        const env = new src_env_1.default({ separatorToken: '3' });
        process.env.TEST3KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST3KEY;
    });
    it("Assert that changing the the default letter case has the expected effect.", function () {
        const env1 = new src_env_1.default({ environmentCase: "lower" });
        process.env.test__key = "1";
        chai_1.expect(env1.get(["test", "key"])).to.be.equals("1");
        delete process.env.test__key;
        const env2 = new src_env_1.default({ environmentCase: "no_change" });
        process.env.TeSt__KeY = "2";
        chai_1.expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
        delete process.env.TeSt__KeY;
    });
    it("Assert that the prefix will be applied.", function () {
        const env = new src_env_1.default({ prefix: "custom" });
        process.env.CUSTOM__TEST__KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.CUSTOM__TEST__KEY;
    });
    it("Assert that the custom name will be used.", function () {
        const env = new src_env_1.default({ name: "custom name" });
        chai_1.expect(env.name).to.be.equals("custom name");
    });
    it("Assert that each key segment could be used as a valid key.", function () {
        process.env['SEGMENT1__SEGMENT2__SEGMENT3'] = '13';
        process.env['SEGMENT1__OTHER'] = '12';
        const env = new src_env_1.default();
        chai_1.expect(env.get(['segment1', 'segment2', 'segment3'])).to.be.equals('13');
        chai_1.expect(env.get(['segment1', 'segment2'])).to.be.deep.equals({ segment3: '13' });
        chai_1.expect(env.get(['segment1'])).to.be.deep.equals({ segment2: { segment3: '13' }, other: '12' });
        delete process.env['SEGMENT1__SEGMENT2__SEGMENT3'];
        delete process.env['SEGMENT1__OTHER'];
    });
    it("Assert that the uppercase token will be applied to the resulting object.", function () {
        process.env['SERVER__HOST_NAME'] = 'test';
        const env = new src_env_1.default({ uppercaseToken: '_' });
        chai_1.expect(env.get(['server', 'hostName'])).to.be.equals('test');
        chai_1.expect(env.get(['server'])).to.be.deep.equals({ hostName: 'test' });
        delete process.env['SERVER__HOST_NAME'];
    });
});
//# sourceMappingURL=src-env.js.map