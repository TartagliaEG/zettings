import {expect} from "chai";
import MemSource from "../../src/sources/src-memory";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("MemorySource", function() {

  it("Assert that #get and #set works as expected.", function() {
    const mem: MemSource = new MemSource();
    expect(mem.get(['a','key'])).to.be.not.ok;

    mem.set(['a', 'key'], 'a value');
    expect(mem.get(['a','key'])).to.be.ok;
  });


  it("Assert that the custom name will be used.", function() {
    const mem: MemSource = new MemSource({name: "custom name"});
    expect(mem.name).to.be.equals("custom name");
  });

});