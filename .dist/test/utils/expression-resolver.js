"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const simple_logger_1 = require("../../src/utils/simple-logger");
const expression_resolver_1 = require("../../src/utils/expression-resolver");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("ExpressionResolver", function () {
    describe('.resolve', function () {
        it("Should resolve the given expression", function () {
            let exp = new expression_resolver_1.ExpressionResolver();
            let valueResolver = sinon_1.stub().returns('newvalue');
            chai_1.expect(exp.resolve("${somevalue}", valueResolver)).to.be.equals('newvalue');
            chai_1.expect(valueResolver.calledOnce).to.be.true;
            chai_1.expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
        });
        it("Should resolve non-primitive values", function () {
            let exp = new expression_resolver_1.ExpressionResolver();
            let valueResolver = sinon_1.stub().returns({ val: 'nonprimitive' });
            chai_1.expect(exp.resolve("${somevalue}", valueResolver)).to.be.deep.equals({ val: 'nonprimitive' });
            chai_1.expect(valueResolver.calledOnce).to.be.true;
            chai_1.expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
        });
        it("Should resolve multiple expressions in the same string", function () {
            let exp = new expression_resolver_1.ExpressionResolver();
            let valueResolver = sinon_1.stub().returns('newvalue');
            chai_1.expect(exp.resolve("${somevalue}-${somevalue}", valueResolver)).to.be.equals('newvalue-newvalue');
            chai_1.expect(valueResolver.calledTwice).to.be.true;
            chai_1.expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
            chai_1.expect(valueResolver.getCall(1).args[0]).to.be.equals("somevalue");
        });
        it("Should resolve expressions from right to left.", function () {
            let exp = new expression_resolver_1.ExpressionResolver();
            let valueResolver = sinon_1.stub().returns('newvalue');
            chai_1.expect(exp.resolve("${somevalue}-${anothervalue}", valueResolver)).to.be.equals('newvalue-newvalue');
            chai_1.expect(valueResolver.calledTwice).to.be.true;
            chai_1.expect(valueResolver.getCall(0).args[0]).to.be.equals("anothervalue");
            chai_1.expect(valueResolver.getCall(1).args[0]).to.be.equals("somevalue");
        });
        it("Should throw a error when the value segment contains a expression that resolves to a non-primitive value.", function () {
            let exp = new expression_resolver_1.ExpressionResolver();
            let valueResolver = sinon_1.stub().returns({ nonprimitive: "value" });
            chai_1.expect(exp.resolve("${non-primitive}", valueResolver)).to.be.deep.equals({ nonprimitive: "value" });
            chai_1.expect(() => exp.resolve("${non-primitive} not-allowed-concatenation", valueResolver)).to.be.throw(Error);
            chai_1.expect(() => exp.resolve("${non-primitive}${not-allowed-concatenation}", valueResolver)).to.be.throw(Error);
        });
    });
});
//# sourceMappingURL=expression-resolver.js.map