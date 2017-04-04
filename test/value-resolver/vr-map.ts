import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import VrMap from "../../src/value-resolver/vr-map";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("VrMap", function() {
  describe('.resolve', function() {

    it("Assert that the configured map will be used to resolve values.", function() {
      const map = new Map<string, any>();
      map.set('obj', {'an': 'object'});
      map.set('pwd', '/path/to/file');
      const v = new VrMap({map: map});
      expect(v.resolve('${key=pwd}')).to.be.equals('/path/to/file');
      expect(v.resolve('${key=obj}')).to.be.deep.equals({'an': 'object'});      
    });

    it("Assert that canHandle returns false when the key doesn't exists", function () {
      const map = new Map<string, any>();
      map.set('key', 'value');
      const v = new VrMap({map: map});
      expect(v.canResolve('${key=key}')).to.be.equals(true);
      expect(v.canResolve('${key=nonExistentKey}')).to.be.equals(false);
    });

  });
});
