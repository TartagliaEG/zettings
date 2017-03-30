import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import MemSource from "../src/memory-source";
import {Options, Source} from "../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../src/simple-logger';

setLoggerLevel(LVL_NONE);

describe("EnvSource", function() {
  
  it(".get & .set", function() {
    const mem: MemSource = new MemSource();
    expect(mem.get(['a','key'])).to.be.not.ok;

    mem.set(['a', 'key'], 'a value');
    expect(mem.get(['a','key'])).to.be.ok;
  });


  it("Set custom name", function() {
    const mem: MemSource = new MemSource({name: "custom name"});        
    expect(mem.name).to.be.equals("custom name");
  });
  
});