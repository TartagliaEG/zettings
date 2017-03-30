"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const memory_source_1 = require("../src/memory-source");
const simple_logger_1 = require("../src/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("EnvSource", function () {
    it(".get & .set", function () {
        const mem = new memory_source_1.default();
        chai_1.expect(mem.get(['a', 'key'])).to.be.not.ok;
        mem.set(['a', 'key'], 'a value');
        chai_1.expect(mem.get(['a', 'key'])).to.be.ok;
    });
    it("Set custom name", function () {
        const mem = new memory_source_1.default({ name: "custom name" });
        chai_1.expect(mem.name).to.be.equals("custom name");
    });
});
//# sourceMappingURL=memory-source.js.map