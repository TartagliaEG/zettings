"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const tr_function_1 = require("../../src/value-transformations/tr-function");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("TrFunction", function () {
    describe('.resolve', function () {
        it("Assert that the function pointed by the path will be called.", function () {
            const v = new tr_function_1.default({ pwd: __dirname });
            chai_1.expect(v.transform('${fn=./tr-function-mock#funct}')).to.be.equals('called');
        });
    });
});
//# sourceMappingURL=tr-function.js.map