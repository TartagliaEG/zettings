import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import {forEachLeaf, toLeaf} from "../../src/utils/node-iteration";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("NodeIteration", function() {
  describe('.forEachLeaf', function() {

    it("Assert that the iteration works with objects.", function() {
      const onReachLeaf = spy(() => false);
      forEachLeaf({a:1, b:2, c:3}, onReachLeaf);
      expect(onReachLeaf.calledThrice).to.be.true;
    });


    it("Assert that the iteration works with arrays.", function() {
      const onReachLeaf = spy(() => false);
      forEachLeaf([1, 2, 3], onReachLeaf);
      expect(onReachLeaf.calledThrice).to.be.true;
    });


    it("Assert that the iteration works with primitives.", function() {
      const onReachLeaf = spy(() => false);
      forEachLeaf(1, onReachLeaf);
      forEachLeaf('a', onReachLeaf);
      forEachLeaf(true, onReachLeaf);
      forEachLeaf(undefined, onReachLeaf);
      forEachLeaf(null, onReachLeaf);
      expect(onReachLeaf.callCount).to.be.equals(5);
    });


    it('Assert that the mutate function changes the value.', function() {
      const obj = {a: 1};

      forEachLeaf(obj, (leaf, mutate): boolean => {
        mutate(2);
        return false;
      });

      expect(obj.a).to.be.equals(2);
    });


    it('Assert that the iteration stops when the callback returns true.', function() {
      const onReachLeaf = spy(() => true);
      forEachLeaf({a: 1, b: 2, c:3}, onReachLeaf);
      expect(onReachLeaf.calledOnce).to.be.true;
      expect(onReachLeaf.calledTwice).to.be.false;
    });


    it('Assert that deeply nested values will be reached.', function() {
      const onReachLeaf = spy((v) => false);
      const deepObj = {level1: {level2: [{level3: {key1: 'value1', key2: 'value2'}}, 'value3']}}
      forEachLeaf(deepObj, onReachLeaf);
      expect(onReachLeaf.calledThrice).to.be.true;
      expect(onReachLeaf.getCall(0).args[0]).to.be.equals('value1');
      expect(onReachLeaf.getCall(1).args[0]).to.be.equals('value2');
      expect(onReachLeaf.getCall(2).args[0]).to.be.equals('value3');
    });


    it('Assert that circular references are ignored.', function() {
      const onReachLeaf = spy(() => false);
      const obj: any = {a: 1, b: 2};
      obj.ref1 = obj;
      obj.ref2 = obj;

      const obj2 = {ref: obj, c: 3};
      obj.ref3 = [obj2];

      forEachLeaf(obj, onReachLeaf);

      expect(onReachLeaf.calledThrice).to.be.true;
    });
  });

  describe('.toLeaf', function() {
    it("Assert that strings become objects and numbers become .", function() {
      expect(toLeaf(['obj'], 1)).to.be.deep.equals({obj: 1});
      expect(toLeaf(['0'], 1)).to.be.deep.equals([1]);
    });

    it("Assert that multiple keys resolves to nested objects/arrays", function() {
      expect(toLeaf(['obj', 'key1', 'key2'], 1)).to.be.deep.equals({obj: {key1: {key2: 1}}});
      expect(toLeaf(['0', '0', '0'], 1)).to.be.deep.equals([[[1]]]);
      expect(toLeaf(['0', 'test', '0'], 1)).to.be.deep.equals([{test: [1]}]);
      expect(toLeaf(['0', 'test', 'test'], 1)).to.be.deep.equals([{test: {test: 1}}]);
    });

    it("Assert that the root parameter could be reused", function() {
      const root = {};
      toLeaf(['first',  'key'], 1, root);
      toLeaf(['second', 'key'], 2, root);
      toLeaf(['arr', '0'], 1, root);
      toLeaf(['arr', '1'], 2, root);
      toLeaf(['arr', '2'], 3, root);

      const expected = {
        first: {key: 1},
        second: {key: 2},
        arr: [1,2,3]
      }
      expect(root).to.be.deep.equals(expected);
    });

  });
});
