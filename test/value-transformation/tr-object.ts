import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import TrObject from "../../src/value-transformations/tr-object";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("TrObject", function() {
  describe('.resolve', function() {

    it("Assert that a node module can be loaded.", function() {
      const v = new TrObject({pwd: __dirname});
      expect(v.transform('${obj=./tr-object-mock}')).to.be.deep.equals({value1: {key: true}});
    });


    it("Assert that a node module property can be accessed.", function() {
      const v = new TrObject({pwd: __dirname});
      expect(v.transform('${obj=./tr-object-mock#value1.key}')).to.be.true;
    });


    it("Assert that a json file can be loaded.", function() {
      const v = new TrObject({pwd: __dirname});
      expect(v.transform('${obj=./tr-object-mock.json}')).to.be.deep.equals({key: "value"});
    });


    it("Assert that a json property can be accessed.", function() {
      const v = new TrObject({pwd: __dirname});
      expect(v.transform('${obj=./tr-object-mock.json#key}')).to.be.equals("value");
    });

  });
});
