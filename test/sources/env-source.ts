import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import EnvSource from "../../src/sources/src-env";
import {Options, Source} from "../../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("EnvSource", function() {
  
  it("Assert that, by default, keys are joined by underscore and toUpperCase is called.", function() {
    const env: EnvSource = new EnvSource();
    process.env.TEST_KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST_KEY;
  });


  it("Assert that changing the key separator has the expected effect.", function() {
    const env: EnvSource = new EnvSource({separator: '3'});
    process.env.TEST3KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST3KEY;
  });


  it("Assert that changing the the default letter case has the expected effect.", function() {
    const env1: EnvSource = new EnvSource({letterCase: "lower"});    
    process.env.test_key = "1";
    expect(env1.get(["test", "key"])).to.be.equals("1");
    delete process.env.test_key;

    const env2: EnvSource = new EnvSource({letterCase: "normal"});
    process.env.TeSt_KeY = "2";
    expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
    delete process.env.TeSt_KeY;
  });


  it("Assert that the prefix will be applied.", function() {
    const env: EnvSource = new EnvSource({prefix: "custom"});
    process.env.CUSTOM_TEST_KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.CUSTOM_TEST_KEY;
  });


  it("Assert that the custom name will be used.", function() {
    const env: EnvSource = new EnvSource({name: "custom name"});    
    expect(env.name).to.be.equals("custom name");
  });
  
});