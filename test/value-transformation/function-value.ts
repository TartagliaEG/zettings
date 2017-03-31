import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import FunctionValue from "../../src/value-transformations/tr-function";
import {ValueTransformation} from "../../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("FunctionValue", function() {

  describe('.resolve', function() {
    it("Assert that function path will be called.", function() {
      const v = new FunctionValue({pwd: __dirname});
      expect(v.transform('${fn=./function-value-test#funct}')).to.be.equals('called');
    });
  });

});
