import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import {forEachLeaf} from "../../src/utils/node-iteration";
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
      const onReachLeaf = spy((v) => {console.log(v); return false});
      const deepObj = {level1: {level2: [{level3: {key1: 'value1', key2: 'value2'}}, 'value3']}}
      forEachLeaf(deepObj, onReachLeaf);
      expect(onReachLeaf.calledThrice).to.be.true;
      expect(onReachLeaf.getCall(0).args[0]).to.be.equals('value1');
      expect(onReachLeaf.getCall(1).args[0]).to.be.equals('value2');
      expect(onReachLeaf.getCall(2).args[0]).to.be.equals('value3');
    });
  });
});
