import { expect } from "chai";
import { stub } from "sinon";
import { setLoggerLevel, LVL_NONE } from '../../src/utils/simple-logger';
import { ExpressionResolver } from '../../src/utils/expression-resolver';

setLoggerLevel(LVL_NONE);

describe("ExpressionResolver", function () {
  describe('.resolve', function () {
    it("Should resolve the given expression", function () {
      let exp = new ExpressionResolver();
      let valueResolver = stub().returns('newvalue');

      expect(exp.resolve("${somevalue}", valueResolver)).to.be.equals('newvalue');
      expect(valueResolver.calledOnce).to.be.true;
      expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
    });


    it("Should resolve non-primitive values", function () {
      let exp = new ExpressionResolver();
      let valueResolver = stub().returns({ val: 'nonprimitive' });

      expect(exp.resolve("${somevalue}", valueResolver)).to.be.deep.equals({ val: 'nonprimitive' });
      expect(valueResolver.calledOnce).to.be.true;
      expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
    });


    it("Should resolve multiple expressions in the same string", function () {
      let exp = new ExpressionResolver();
      let valueResolver = stub().returns('newvalue');

      expect(exp.resolve("${somevalue}-${somevalue}", valueResolver)).to.be.equals('newvalue-newvalue');
      expect(valueResolver.calledTwice).to.be.true;
      expect(valueResolver.getCall(0).args[0]).to.be.equals("somevalue");
      expect(valueResolver.getCall(1).args[0]).to.be.equals("somevalue");
    });


    it("Should resolve expressions from right to left.", function () {
      let exp = new ExpressionResolver();
      let valueResolver = stub().returns('newvalue');

      expect(exp.resolve("${somevalue}-${anothervalue}", valueResolver)).to.be.equals('newvalue-newvalue');
      expect(valueResolver.calledTwice).to.be.true;
      expect(valueResolver.getCall(0).args[0]).to.be.equals("anothervalue");
      expect(valueResolver.getCall(1).args[0]).to.be.equals("somevalue");
    });


    it("Should throw a error when the value segment contains a expression that resolves to a non-primitive value.", function () {
      let exp = new ExpressionResolver();
      let valueResolver = stub().returns({ nonprimitive: "value" });

      expect(exp.resolve("${non-primitive}", valueResolver)).to.be.deep.equals({ nonprimitive: "value" });
      expect(() => exp.resolve("${non-primitive} not-allowed-concatenation", valueResolver)).to.be.throw(Error);
      expect(() => exp.resolve("${non-primitive}${not-allowed-concatenation}", valueResolver)).to.be.throw(Error);
    });
  });
});
