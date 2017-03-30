import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import EnvSource from "../src/env-source";
import {Options, Source} from "../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../src/simple-logger';

setLoggerLevel(LVL_NONE);

describe("EnvSource", function() {
  
  it("Assert that, by default, keys are joined by underscore and changed to upper case.", function() {
    const env: EnvSource = new EnvSource();
    process.env.TEST_KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST_KEY;
  });


  it("Change the default key separator", function() {
    const env: EnvSource = new EnvSource({separator: '3'});
    process.env.TEST3KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST3KEY;
  });


  it("Change the default letter case", function() {
    const env1: EnvSource = new EnvSource({letterCase: "lower"});    
    process.env.test_key = "1";
    expect(env1.get(["test", "key"])).to.be.equals("1");
    delete process.env.test_key;

    const env2: EnvSource = new EnvSource({letterCase: "normal"});
    process.env.TeSt_KeY = "2";
    expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
    delete process.env.TeSt_KeY;
  });


  it("Set a default prefix", function() {
    const env: EnvSource = new EnvSource({prefix: "custom"});
    process.env.CUSTOM_TEST_KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.CUSTOM_TEST_KEY;
  });


  it("Set custom name", function() {
    const env: EnvSource = new EnvSource({name: "custom name"});    
    expect(env.name).to.be.equals("custom name");
  });
  
});