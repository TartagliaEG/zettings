import {expect} from "chai";
import EnvSource from "../../src/sources/src-env";
import {setLoggerLevel, LVL_NONE} from '../../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);

describe("EnvSource", function() {

  it("Assert that, by default, keys are joined by two underscores and toUpperCase is called.", function() {
    const env: EnvSource = new EnvSource();
    process.env.TEST__KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST__KEY;
  });


  it("Assert that changing the key separator has the expected effect.", function() {
    const env: EnvSource = new EnvSource({separatorToken: '3'});
    process.env.TEST3KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.TEST3KEY;
  });


  it("Assert that changing the the default letter case has the expected effect.", function() {
    const env1: EnvSource = new EnvSource({environmentCase: "lower"});
    process.env.test__key = "1";
    expect(env1.get(["test", "key"])).to.be.equals("1");
    delete process.env.test__key;

    const env2: EnvSource = new EnvSource({environmentCase: "no_change"});
    process.env.TeSt__KeY = "2";
    expect(env2.get(["TeSt", "KeY"])).to.be.equals("2");
    delete process.env.TeSt__KeY;
  });


  it("Assert that the prefix will be applied.", function() {
    const env: EnvSource = new EnvSource({prefix: "custom"});
    process.env.CUSTOM__TEST__KEY = "1";
    expect(env.get(["test", "key"])).to.be.equals("1");
    delete process.env.CUSTOM__TEST__KEY;
  });


  it("Assert that the custom name will be used.", function() {
    const env: EnvSource = new EnvSource({name: "custom name"});
    expect(env.name).to.be.equals("custom name");
  });


  it("Assert that each key segment could be used as a valid key.", function() {
    process.env['SEGMENT1__SEGMENT2__SEGMENT3'] = '13';
    process.env['SEGMENT1__OTHER'] = '12';
    const env: EnvSource = new EnvSource();

    expect(env.get(['segment1', 'segment2', 'segment3'])).to.be.equals('13');
    expect(env.get(['segment1', 'segment2'])).to.be.deep.equals({segment3: '13'});
    expect(env.get(['segment1'])).to.be.deep.equals({ segment2: {segment3: '13'}, other: '12'});

    delete process.env['SEGMENT1__SEGMENT2__SEGMENT3'];
    delete process.env['SEGMENT1__OTHER'];
  });


  it("Assert that the uppercase token will be applied to the resulting object.", function() {
    process.env['SERVER__HOST_NAME'] = 'test';
    const env: EnvSource = new EnvSource({uppercaseToken: '_'});

    expect(env.get(['server', 'hostName'])).to.be.equals('test');
    expect(env.get(['server'])).to.be.deep.equals({hostName: 'test'});

    delete process.env['SERVER__HOST_NAME'];
  });

  it("Assert that numbers are resolved to arrays", function() {
    const env: EnvSource = new EnvSource();

    process.env['SERVER__CONNECTIONS__0'] = '192.168.0.2';
    process.env['SERVER__CONNECTIONS__1'] = '192.168.0.3';
    expect(env.get(['server'])).to.be.deep.equals({connections: ['192.168.0.2', '192.168.0.3']});

    delete process.env['SERVER__CONNECTIONS__0'];
    delete process.env['SERVER__CONNECTIONS__1'];

    process.env['SERVER__CONNECTIONS__0__IP'] = '192.168.0.2';
    process.env['SERVER__CONNECTIONS__1__IP'] = '192.168.0.3';
    expect(env.get(['server'])).to.be.deep.equals({connections: [{ip: '192.168.0.2'}, {ip: '192.168.0.3'}]});

    delete process.env['SERVER__CONNECTIONS__0__IP'];
    delete process.env['SERVER__CONNECTIONS__1__IP'];
  });

  it("Assert that multiples numbers in the same key are resolved to nested arrays", function() {
    const env: EnvSource = new EnvSource();

    process.env['SERVER__0__0'] = '192.168.0.2';
    process.env['SERVER__0__1'] = '192.168.0.3';

    expect(env.get(['server'])).to.be.deep.equals([['192.168.0.2', '192.168.0.3']]);
  });

  it("Assert that configuring both uppercaseToken to any valid string and environmentCase to 'no_change' throw an error", function() {
    expect(() => { new EnvSource({environmentCase: 'no_change', uppercaseToken: '_'}) }).to.throw(Error);
  });

});