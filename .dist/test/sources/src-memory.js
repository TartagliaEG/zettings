"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_memory_1 = require("../../src/sources/src-memory");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("MemorySource", function () {
    it("Assert that #get and #set works as expected.", function () {
        const mem = new src_memory_1.default();
        chai_1.expect(mem.get(['a', 'key'])).to.be.not.ok;
        mem.set(['a', 'key'], 'a value');
        chai_1.expect(mem.get(['a', 'key'])).to.be.ok;
    });
    it("Assert that the custom name will be used.", function () {
        const mem = new src_memory_1.default({ name: "custom name" });
        chai_1.expect(mem.name).to.be.equals("custom name");
    });
});
//# sourceMappingURL=src-memory.js.map