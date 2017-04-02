import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import VrReference from "../../src/value-resolver/vr-reference";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("TrObject", function() {
  describe('.resolve', function() {

    it("Assert that a node module can be loaded.", function() {
      const v = new VrReference({pwd: __dirname});
      expect(v.resolve('${ref=./tr-object-mock}')).to.be.deep.equals({value1: {key: true}});
    });


    it("Assert that a node module property can be accessed.", function() {
      const v = new VrReference({pwd: __dirname});
      expect(v.resolve('${ref=./tr-object-mock#value1.key}')).to.be.true;
    });


    it("Assert that a json file can be loaded.", function() {
      const v = new VrReference({pwd: __dirname});
      expect(v.resolve('${ref=./tr-object-mock.json}')).to.be.deep.equals({key: "value"});
    });


    it("Assert that a json property can be accessed.", function() {
      const v = new VrReference({pwd: __dirname});
      expect(v.resolve('${ref=./tr-object-mock.json#key}')).to.be.equals("value");
    });

  });
});