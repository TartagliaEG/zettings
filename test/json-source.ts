import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import JsonSource from "../src/json-source";
import {Options, Source} from "../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../src/simple-logger';

setLoggerLevel(LVL_NONE);

describe("JsonSource", function() {
  
  it("Assert that the JsonSource is loading the specified path.", function() {
    const jso: JsonSource = new JsonSource({paths: ['json-source-config1.json'], pwd: __dirname});
    expect(jso.get(["key1"])).to.be.equals("value1");
    expect(jso.get(["key2", "subKey"])).to.be.equals(undefined);
  });


  it("Assert that the JsonSource can load multiple jsons.", function() {
    const jso: JsonSource = new JsonSource({pwd: __dirname, paths: ['/json-source-config1.json', "json-source-config2.json"]});
    expect(jso.get(["key1"])).to.be.equals("value1");
    expect(jso.get(["key2", "subKey"])).to.be.equals("value2");
  });

  it("Assert that the custom name will be used.", function() {
    const env: JsonSource = new JsonSource({name: "custom name", paths: []});    
    expect(env.name).to.be.equals("custom name");
  });
  
});