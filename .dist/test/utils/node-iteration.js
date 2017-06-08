"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const node_iteration_1 = require("../../src/utils/node-iteration");
const simple_logger_1 = require("../../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("NodeIteration", function () {
    describe('.forEachLeaf', function () {
        it("Should iterate over objects.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf({ a: 1, b: 2, c: 3 }, onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
        });
        it("Should iterate over arrays.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf([1, 2, 3], onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
        });
        it("Should iterate over primitives.", function () {
            const onReachLeaf = sinon_1.spy(() => false);
            node_iteration_1.forEachLeaf(1, onReachLeaf);
            node_iteration_1.forEachLeaf('a', onReachLeaf);
            node_iteration_1.forEachLeaf(true, onReachLeaf);
            node_iteration_1.forEachLeaf(undefined, onReachLeaf);
            node_iteration_1.forEachLeaf(null, onReachLeaf);
            chai_1.expect(onReachLeaf.callCount).to.be.equals(5);
        });
        it('Should allow value mutation during the iteration.', function () {
            const obj = { a: 1 };
            node_iteration_1.forEachLeaf(obj, (leaf, mutate) => {
                mutate(2);
                return 'CONTINUE_ITERATION';
            });
            chai_1.expect(obj.a).to.be.equals(2);
        });
        it('Should interrupt the iteration when the callback returns "BREAK_ITERATION".', function () {
            const onReachLeaf = sinon_1.spy(() => "BREAK_ITERATION");
            node_iteration_1.forEachLeaf({ a: 1, b: 2, c: 3 }, onReachLeaf);
            chai_1.expect(onReachLeaf.calledOnce).to.be.true;
            chai_1.expect(onReachLeaf.calledTwice).to.be.false;
        });
        it('Should reach in deeply nested values.', function () {
            const onReachLeaf = sinon_1.spy((v) => false);
            const deepObj = { level1: { level2: [{ level3: { key1: 'value1', key2: 'value2' } }, 'value3'] } };
            node_iteration_1.forEachLeaf(deepObj, onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
            chai_1.expect(onReachLeaf.getCall(0).args[0]).to.be.equals('value1');
            chai_1.expect(onReachLeaf.getCall(1).args[0]).to.be.equals('value2');
            chai_1.expect(onReachLeaf.getCall(2).args[0]).to.be.equals('value3');
        });
        it('Should ignore circular references.', function () {
            const onReachLeaf = sinon_1.spy(() => false);
            const obj = { a: 1, b: 2 };
            obj.ref1 = obj;
            obj.ref2 = obj;
            const obj2 = { ref: obj, c: 3 };
            obj.ref3 = [obj2];
            node_iteration_1.forEachLeaf(obj, onReachLeaf);
            chai_1.expect(onReachLeaf.calledThrice).to.be.true;
        });
    });
    describe('.toLeaf', function () {
        it("Should handle strings as object keys and numbers as array indexes.", function () {
            chai_1.expect(node_iteration_1.toLeaf(['obj'], 1)).to.be.deep.equals({ obj: 1 });
            chai_1.expect(node_iteration_1.toLeaf(['0'], 1)).to.be.deep.equals([1]);
        });
        it("Should work with deeply nested properties and indexes", function () {
            chai_1.expect(node_iteration_1.toLeaf(['obj', 'key1', 'key2'], 1)).to.be.deep.equals({ obj: { key1: { key2: 1 } } });
            chai_1.expect(node_iteration_1.toLeaf(['0', '0', '0'], 1)).to.be.deep.equals([[[1]]]);
            chai_1.expect(node_iteration_1.toLeaf(['0', 'test', '0'], 1)).to.be.deep.equals([{ test: [1] }]);
            chai_1.expect(node_iteration_1.toLeaf(['0', 'test', 'test'], 1)).to.be.deep.equals([{ test: { test: 1 } }]);
        });
        it("Assert that the root parameter could be reused", function () {
            const root = {};
            node_iteration_1.toLeaf(['first', 'key'], 1, root);
            node_iteration_1.toLeaf(['second', 'key'], 2, root);
            node_iteration_1.toLeaf(['arr', '0'], 1, root);
            node_iteration_1.toLeaf(['arr', '1'], 2, root);
            node_iteration_1.toLeaf(['arr', '2'], 3, root);
            const expected = {
                first: { key: 1 },
                second: { key: 2 },
                arr: [1, 2, 3]
            };
            chai_1.expect(root).to.be.deep.equals(expected);
        });
    });
});
//# sourceMappingURL=node-iteration.js.map