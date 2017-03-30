"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const env_source_1 = require("../src/env-source");
const simple_logger_1 = require("../src/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("EnvSource", function () {
    it("Assert that, by default, keys are joined by underscore and changed to upper case.", function () {
        const env = new env_source_1.default();
        process.env.TEST_KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST_KEY;
    });
    it("Change the default key separator", function () {
        const env = new env_source_1.default({ separator: '3' });
        process.env.TEST3KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.TEST3KEY;
    });
    it("Change the default letter case", function () {
        const env1 = new env_source_1.default({ letterCase: "lower" });
        process.env.test_key = "1";
        chai_1.expect(env1.get(["test", "key"])).to.be.equals("1");
        delete process.env.test_key;
        const env2 = new env_source_1.default({ letterCase: "normal" });
        process.env.TeSt_KeY = "2";
        chai_1.expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
        delete process.env.TeSt_KeY;
    });
    it("Set a default prefix", function () {
        const env = new env_source_1.default({ prefix: "custom" });
        process.env.CUSTOM_TEST_KEY = "1";
        chai_1.expect(env.get(["test", "key"])).to.be.equals("1");
        delete process.env.CUSTOM_TEST_KEY;
    });
    it("Set custom name", function () {
        const env = new env_source_1.default({ name: "custom name" });
        chai_1.expect(env.name).to.be.equals("custom name");
    });
});
//# sourceMappingURL=env-source.js.map