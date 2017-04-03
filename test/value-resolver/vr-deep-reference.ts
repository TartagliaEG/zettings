import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import VrDeepRef from "../../src/value-resolver/vr-deep-reference";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("VrDeepRef", function() {
  describe('.resolve', function() {

    it("Assert that nested references can be loaded.", function() {
      const v = new VrDeepRef({pwd: __dirname});
      expect(v.resolve({ 
        root: '${ref=./vr-reference-mock}', 
        arr: [ '${ref=./vr-reference-mock.json}' ] 
      })).to.be.deep.equals({
        root: { value1: { key: true } }, 
        arr: [{ "key": "value" }]
      });
    });

  });
});
