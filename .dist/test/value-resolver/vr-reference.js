"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vr_reference_1 = require("../../src/value-resolver/vr-reference");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("VrReference", function () {
    describe('.resolve', function () {
        it("Should load node modules.", function () {
            const v = new vr_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve('ref=./vr-reference-mock')).to.be.deep.equals({ value1: { key: true } });
        });
        it("Should load node modules variables.", function () {
            const v = new vr_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve('ref=./vr-reference-mock#value1.key')).to.be.true;
            chai_1.expect(v.resolve('ref=./vr-reference-mock#value1')).to.be.deep.equals({ key: true });
        });
        it("Should load json files.", function () {
            const v = new vr_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve('ref=./vr-reference-mock.json')).to.be.deep.equals({ key: "value" });
        });
        it("Should load json properties.", function () {
            const v = new vr_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve('ref=./vr-reference-mock.json#key')).to.be.equals("value");
        });
        it("Should load third-party libraries.", function () {
            const v = new vr_reference_1.default({ pwd: __dirname });
            chai_1.expect(v.resolve('ref=lodash')).to.be.a('function');
        });
    });
});
//# sourceMappingURL=vr-reference.js.map