"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vr_map_1 = require("../../src/value-resolver/vr-map");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("VrMap", function () {
    describe('.resolve', function () {
        it("Assert that the configured map will be used to resolve values.", function () {
            const map = new Map();
            map.set('obj', { 'an': 'object' });
            map.set('pwd', '/path/to/file');
            const v = new vr_map_1.default({ map: map });
            chai_1.expect(v.resolve('key=pwd')).to.be.equals('/path/to/file');
            chai_1.expect(v.resolve('key=obj')).to.be.deep.equals({ 'an': 'object' });
        });
        it("Assert that canHandle returns false when the key doesn't exists", function () {
            const map = new Map();
            map.set('key', 'value');
            const v = new vr_map_1.default({ map: map });
            chai_1.expect(v.canResolve('key=key')).to.be.equals(true);
            chai_1.expect(v.canResolve('key=nonExistentKey')).to.be.equals(false);
        });
    });
});
//# sourceMappingURL=vr-map.js.map