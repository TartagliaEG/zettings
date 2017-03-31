"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_env_1 = require("../../src/sources/src-env");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("EnvSource", function () {
    it("Assert that, by default, keys are joined by underscore and toUpperCase is called.", function () {
        const env = new src_env_1.default();
        process.env.TEST_KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST_KEY;
    });
    it("Assert that changing the key separator has the expected effect.", function () {
        const env = new src_env_1.default({ separator: '3' });
        process.env.TEST3KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST3KEY;
    });
    it("Assert that changing the the default letter case has the expected effect.", function () {
        const env1 = new src_env_1.default({ letterCase: "lower" });
        process.env.test_key = "1";
        chai_1.expect(env1.get(["test", "key"])).to.be.equals("1");
        delete process.env.test_key;
        const env2 = new src_env_1.default({ letterCase: "normal" });
        process.env.TeSt_KeY = "2";
        chai_1.expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
        delete process.env.TeSt_KeY;
    });
    it("Assert that the prefix will be applied.", function () {
        const env = new src_env_1.default({ prefix: "custom" });
        process.env.CUSTOM_TEST_KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.CUSTOM_TEST_KEY;
    });
    it("Assert that the custom name will be used.", function () {
        const env = new src_env_1.default({ name: "custom name" });
        chai_1.expect(env.name).to.be.equals("custom name");
    });
});
//# sourceMappingURL=env-source.js.map