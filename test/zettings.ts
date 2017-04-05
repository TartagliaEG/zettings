import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import Zettings from "../src/zettings";
import {Options, Source} from "../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);
const pwd = {pwd: ''};

describe("Zettings", function() {

  describe(".addSource & .count & .addValueResolver", function() {
    it("Assert that source names are unique per profile.", function() {
      const Z = new Zettings(pwd);
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      Z.addSource(mock);    
      expect(() => { Z.addSource(mock) }).to.throw(Error);    

      Z.addSource(mock, 'other_profile');    
      expect(() => { Z.addSource(mock, 'other_profile') }).to.throw(Error);
    });


    it("Assert that the keyword 'total' can't be used as a profile", function() {
      const Z = new Zettings(pwd);
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      expect(() => {Z.addSource(mock, 'total')}).to.throw(Error);
    });


    it("Assert that #count works per profile.", function() {    
      const Z = new Zettings(pwd);    
      const count = Z.count();
      const mock1: Source = {name: "1", get: (a:string[]) => null};
      const mock2: Source = {name: "2", get: (a:string[]) => null};
      const mock3: Source = {name: "3", get: (a:string[]) => null};

      expect(Z.count()).to.be.equals(count);

      Z.addSource(mock1);
      expect(Z.count()).to.be.equals(count + 1);

      Z.addSource(mock2);
      Z.addSource(mock3);
      expect(Z.count()).to.be.equals(count + 3);
    });


    it("Assert that #addValueResolver is being applied on #get", function() {
      const Z = new Zettings(pwd);
      Z.addValueResolver({name: "any", canResolve: () => true, resolve: () => 'ok'});
      Z.addSource({get:() => "value", name: 'any'});
      expect(Z.getf('-')).to.be.equals('ok');
    });
  });


  describe(".getf & .set", function() {

    it("Assert that the source's #get method receives the key as a token array.", function() {
      const Z = new Zettings(pwd);
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      const spGet = spy(mock, "get");
          
      Z.addSource(mock);
      Z.getf("key[2].with.multiple[5][3][4].sections");
      expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);    

      spGet.restore();
    });


    it("Assert that sources with no matching profiles won't be used to retrieve values.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = { get: (key: string[]): any => {return 1;}, name: "1" };
      const mock2: Source = { get: (key: string[]): any => {return 2;}, name: "2" };

      Z.addSource(mock1, 'profile_one');
      Z.addSource(mock2, 'profile_two');
      // call get using the default profile
      expect(Z.getf('key')).to.not.be.ok;

      Z.changeProfile('profile_one');
      expect(Z.getf('key')).to.be.equals(1);

      Z.changeProfile('profile_two');
      expect(Z.getf('key')).to.be.equals(2);

      Z.changeProfile(Z.DEF_PROFILE);
      expect(Z.getf('key')).to.not.be.ok;    
    });


    it("Assert that #getf returns the default value.", function() {
      const Z = new Zettings(pwd);

      expect(Z.getf('none', 1)).to.be.equals(1);      
    });


    it("Assert that #getf calls the source with highest priority first.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = {name: "1", get: (a: string[]) => "one"  };
      const mock2: Source = {name: "2", get: (a: string[]) => "two"  };
      const mock3: Source = {name: "3", get: (a: string[]) => "three"};

      Z.addSource(mock1, 10);
      expect(Z.getf("a")).to.be.equals("one");

      Z.addSource(mock2, 11);
      expect(Z.getf("a")).to.be.equals("one");

      Z.addSource(mock3, 9);
      expect(Z.getf("a")).to.be.equals("three");

      const spMock1 = spy(mock1, "get");
      const spMock3 = spy(mock3, "get");

      Z.getf("a");
      expect(spMock1.notCalled).to.be.true;
      expect(spMock3.called).to.be.true;
    });  


    it("Assert that #set throws an error when there're no sources implementing it.", function() {
      const Z = new Zettings(pwd);
      Z.changeProfile('profile_with_no_sources');
      expect(() => {Z.set('key', 'value')}).to.throw(Error);
    });
  });  

  describe(".getm", function() {
    it("Assert that #getm will merge objects from multiple sources.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = {name: "1", get: (a: string[]) => {return {'key1': 'a'}}};
      const mock2: Source = {name: "2", get: (a: string[]) => {return {'key2': 'b'}}};
      const mock3: Source = {name: "3", get: (a: string[]) => {return {'key3': 'c'}}};

      Z.addSource(mock1);
      Z.addSource(mock2);
      Z.addSource(mock3);

      expect(Z.getm('a')).to.be.deep.equals({'key1': 'a', 'key2': 'b', 'key3': 'c'});
    });


    it("Assert that #getm will merge sources based on its priority.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = {name: "1", get: (a: string[]) => {return {'key1': 'a'}}};
      const mock2: Source = {name: "2", get: (a: string[]) => {return {'key1': 'b'}}};
      const mock3: Source = {name: "3", get: (a: string[]) => {return {'key1': 'c'}}};

      Z.addSource(mock1, 11);
      Z.addSource(mock2, 10);
      Z.addSource(mock3, 12);

      expect(Z.getm('a')).to.be.deep.equals({'key1': 'b'});
    });    


    it("Assert that #getm merge only objects.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = {name: "1", get: (a: string[]) => {return {'key1': 'a'}}};
      const mock2: Source = {name: "2", get: (a: string[]) => 'non-object' };

      Z.addSource(mock1, 11);
      Z.addSource(mock2, 12);

      expect(Z.getm('a')).to.be.deep.equals({'key1': 'a'});
    });


    it("Assert that #getm doesn't search other sources when the first one returns a primitive value.", function() {
      const Z = new Zettings(pwd);
      const get = spy((a: string[]) => 'non-object');
      const mock1: Source = {name: "1", get: (a: string[]) => 'first-value'};
      const mock2: Source = {name: "2", get: get};

      Z.getm('a');

      expect(get.notCalled).to.be.true;
    });


    it("Assert that #getm retrieve values from the source with highest priority.", function() {
      const Z = new Zettings(pwd);
      const mock1: Source = {name: "1", get: (a: string[]) => "one"  };
      const mock2: Source = {name: "2", get: (a: string[]) => "two"  };
      const mock3: Source = {name: "3", get: (a: string[]) => "three"};

      Z.addSource(mock1, 10);
      expect(Z.getm("a")).to.be.equals("one");

      Z.addSource(mock2, 11);
      expect(Z.getm("a")).to.be.equals("one");

      Z.addSource(mock3, 9);
      expect(Z.getm("a")).to.be.equals("three");

      const spMock1 = spy(mock1, "get");
      const spMock3 = spy(mock3, "get");

      Z.getf("a");
      expect(spMock1.notCalled).to.be.true;
      expect(spMock3.called).to.be.true;
    });    
  });
  
  
  it('Assert that there are default sources configured.', function() {
    const Z = new Zettings(pwd);
    expect(Z.count()).to.be.greaterThan(0);
  });


  it("Assert that default sources can be disabled.", function() {
    const Z = new Zettings({
      defaultEnvSource: false,
      defaultMemoSource: false,
      pwd: ''
    });

    expect(Z.count()).to.be.equals(0);
  });  

});

