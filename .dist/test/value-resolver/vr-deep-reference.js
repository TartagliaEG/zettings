"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vr_deep_reference_1 = require("../../src/value-resolver/vr-deep-reference");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("VrDeepRef", function () {
    describe('.resolve', function () {
        it("Assert that nested references can be loaded.", function () {
            const v = new vr_deep_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve({
                root: '${ref=./vr-reference-mock}',
                arr: ['${ref=./vr-reference-mock.json}']
            })).to.be.deep.equals({
                root: { value1: { key: true } },
                arr: [{ "key": "value" }]
            });
        });
    });
});
//# sourceMappingURL=vr-deep-reference.js.map