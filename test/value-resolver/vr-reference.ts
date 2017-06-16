import { expect } from "chai";
import VrReference from "../../src/value-resolver/vr-reference";
import { setLoggerLevel, LVL_NONE } from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("VrReference", function () {
  describe('.resolve', function () {

    it("Should load node modules.", function () {
      const v = new VrReference({ pwd: __dirname });
      expect(v.resolve('ref=./vr-reference-mock')).to.be.deep.equals({ value1: { key: true } });
    });


    it("Should load node modules variables.", function () {
      const v = new VrReference({ pwd: __dirname });
      expect(v.resolve('ref=./vr-reference-mock#value1.key')).to.be.true;
      expect(v.resolve('ref=./vr-reference-mock#value1')).to.be.deep.equals({ key: true });
    });


    it("Should load json files.", function () {
      const v = new VrReference({ pwd: __dirname });
      expect(v.resolve('ref=./vr-reference-mock.json')).to.be.deep.equals({ key: "value" });
    });


    it("Should load json properties.", function () {
      const v = new VrReference({ pwd: __dirname });
      expect(v.resolve('ref=./vr-reference-mock.json#key')).to.be.equals("value");
    });

    it("Should load third-party libraries.", function () {
      const v = new VrReference({ pwd: __dirname });
      expect(v.resolve('ref=lodash')).to.be.a('function');
    });

  });
});
