"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const node_iteration_1 = require("../../src/utils/node-iteration");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("NodeIteration", function () {
    describe('.forEachLeaf', function () {
        it("Assert that the iteration works with objects.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf({ a: 1, b: 2, c: 3 }, onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
        });
        it("Assert that the iteration works with arrays.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf([1, 2, 3], onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
        });
        it("Assert that the iteration works with primitives.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf(1, onReachLeaf);
            node_iteration_1.forEachLeaf('a', onReachLeaf);
            node_iteration_1.forEachLeaf(true, onReachLeaf);
            node_iteration_1.forEachLeaf(undefined, onReachLeaf);
            node_iteration_1.forEachLeaf(null, onReachLeaf);
            chai_1.expect(onReachLeaf.callCount).to.be.equals(5);
        });
        it('Assert that the mutate function changes the value.', function () {
            const obj = { a: 1 };
            node_iteration_1.forEachLeaf(obj, (leaf, mutate) => {
                mutate(2);
                return false;
            });
            chai_1.expect(obj.a).to.be.equals(2);
        });
        it('Assert that the iteration stops when the callback returns true.', function () {
            const onReachLeaf = sinon_1.spy(() => true);
            node_iteration_1.forEachLeaf({ a: 1, b: 2, c: 3 }, onReachLeaf);
            chai_1.expect(onReachLeaf.calledOnce).to.be.true;
            chai_1.expect(onReachLeaf.calledTwice).to.be.false;
        });
        it('Assert that deeply nested values will be reached.', function () {
            const onReachLeaf = sinon_1.spy((v) => { console.log(v); return false; });
            const deepObj = { level1: { level2: [{ level3: { key1: 'value1', key2: 'value2' } }, 'value3'] } };
            node_iteration_1.forEachLeaf(deepObj, onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
            chai_1.expect(onReachLeaf.getCall(0).args[0]).to.be.equals('value1');
            chai_1.expect(onReachLeaf.getCall(1).args[0]).to.be.equals('value2');
            chai_1.expect(onReachLeaf.getCall(2).args[0]).to.be.equals('value3');
        });
    });
});
//# sourceMappingURL=node-iteration.js.map