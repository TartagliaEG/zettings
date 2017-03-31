"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_json_1 = require("../../src/sources/src-json");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("JsonSource", function () {
    it("Assert that the JsonSource is loading the specified path.", function () {
        const jso = new src_json_1.default({ paths: ['json-source-config1.json'], pwd: __dirname });
        chai_1.expect(jso.get(["key1"])).to.be.equals("value1");
        chai_1.expect(jso.get(["key2", "subKey"])).to.be.equals(undefined);
    });
    it("Assert that the JsonSource can load multiple jsons.", function () {
        const jso = new src_json_1.default({ pwd: __dirname, paths: ['/json-source-config1.json', "json-source-config2.json"] });
        chai_1.expect(jso.get(["key1"])).to.be.equals("value1");
        chai_1.expect(jso.get(["key2", "subKey"])).to.be.equals("value2");
    });
    it("Assert that the custom name will be used.", function () {
        const env = new src_json_1.default({ name: "custom name", paths: [] });
        chai_1.expect(env.name).to.be.equals("custom name");
    });
});
//# sourceMappingURL=json-source.js.map