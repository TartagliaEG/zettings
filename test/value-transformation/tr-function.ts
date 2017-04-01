import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import TrFunction from "../../src/value-transformations/tr-function";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("TrFunction", function() {

  describe('.resolve', function() {
    it("Assert that the function pointed by the path will be called.", function() {
      const v = new TrFunction({pwd: __dirname});
      expect(v.transform('${fn=./tr-function-mock#funct}')).to.be.equals('called');
    });
  });

});
