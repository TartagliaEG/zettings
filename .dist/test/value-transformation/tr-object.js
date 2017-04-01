"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const tr_object_1 = require("../../src/value-transformations/tr-object");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("TrObject", function () {
    describe('.resolve', function () {
        it("Assert that a node module can be loaded.", function () {
            const v = new tr_object_1.default({ pwd: __dirname });
            chai_1.expect(v.transform('${obj=./tr-object-mock}')).to.be.deep.equals({ value1: { key: true } });
        });
        it("Assert that a node module property can be accessed.", function () {
            const v = new tr_object_1.default({ pwd: __dirname });
            chai_1.expect(v.transform('${obj=./tr-object-mock#value1.key}')).to.be.true;
        });
        it("Assert that a json file can be loaded.", function () {
            const v = new tr_object_1.default({ pwd: __dirname });
            chai_1.expect(v.transform('${obj=./tr-object-mock.json}')).to.be.deep.equals({ key: "value" });
        });
        it("Assert that a json property can be accessed.", function () {
            const v = new tr_object_1.default({ pwd: __dirname });
            chai_1.expect(v.transform('${obj=./tr-object-mock.json#key}')).to.be.equals("value");
        });
    });
});
//# sourceMappingURL=tr-object.js.map