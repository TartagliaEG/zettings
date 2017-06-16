import {expect} from "chai";
import JsonSource from "../../src/sources/src-json";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("JsonSource", function() {

  it("Assert that the JsonSource is loading the specified path.", function() {
    const jso: JsonSource = new JsonSource({paths: ['src-json-config1.json'], pwd: __dirname});
    expect(jso.get(["key1"])).to.be.equals("value1");
    expect(jso.get(["key2", "subKey"])).to.be.equals(undefined);
  });


  it("Assert that the JsonSource can load multiple jsons.", function() {
    const jso: JsonSource = new JsonSource({pwd: __dirname, paths: ['/src-json-config1.json', "src-json-config2.json"]});
    expect(jso.get(["key1"])).to.be.equals("value1");
    expect(jso.get(["key2", "subKey"])).to.be.equals("value2");
  });

  it("Assert that the custom name will be used.", function() {
    const env: JsonSource = new JsonSource({name: "custom name", paths: []});
    expect(env.name).to.be.equals("custom name");
  });

});