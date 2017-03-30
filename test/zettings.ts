import {expect} from "chai";
import {stub, spy, SinonStub} from "sinon";
import Zettings from "../src/zettings";
import {Options, Source} from "../src/zettings";
import {setLoggerLevel, LVL_NONE} from '../src/simple-logger';

setLoggerLevel(LVL_NONE);


describe("Zettings", function() {

  describe(".addSource & .count", function() {
    it("Assert that source names are unique per profile.", function() {
      const Z = new Zettings();
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      Z.addSource(mock);    
      expect(() => { Z.addSource(mock) }).to.throw(Error);    

      Z.addSource(mock, 'other_profile');    
      expect(() => { Z.addSource(mock, 'other_profile') }).to.throw(Error);
    });


    it("Assert that the keyword 'total' can't be used as a profile", function() {
      const Z = new Zettings();
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      expect(() => {Z.addSource(mock, 'total')}).to.throw(Error);
    });


    it("Assert that #count works per profile.", function() {    
      const Z = new Zettings();    
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
  });

  describe(".get & .getf & .set", function() {

    it("Assert that the source's #get method receives the key as a token array.", function() {
      const Z = new Zettings();
      const mock: Source = { get: (key: string[]): any => {return 1;}, name: "mock" };

      const spGet = spy(mock, "get");
          
      Z.addSource(mock);
      Z.get("key[2].with.multiple[5][3][4].sections");
      expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);    

      spGet.restore();
    });


    it("Assert that sources with no matching profiles won't be used to retrieve values.", function() {
      const Z = new Zettings();
      const mock1: Source = { get: (key: string[]): any => {return 1;}, name: "1" };
      const mock2: Source = { get: (key: string[]): any => {return 2;}, name: "2" };

      Z.addSource(mock1, 'profile_one');
      Z.addSource(mock2, 'profile_two');
      // call get using the default profile
      expect(Z.get('key')).to.not.be.ok;

      Z.changeProfile('profile_one');
      expect(Z.get('key')).to.be.equals(1);

      Z.changeProfile('profile_two');
      expect(Z.get('key')).to.be.equals(2);

      Z.changeProfile(Z.DEF_PROFILE);
      expect(Z.get('key')).to.not.be.ok;
    
    });


    it("Assert that #get and #getf returns the default value.", function() {
      const Z = new Zettings();    

      expect(Z.get('none', 1)).to.be.equals(1);
      expect(Z.getf('none', 1)).to.be.equals(1);
    });


    it("Assert that #getf throws an error when the source returns undefined.", function() {
      const Z = new Zettings();    
      expect(() => { Z.getf("willthrowerror") }).to.throw(Error); });

      it("Assert that #get calls the source with highest priority first.", function() {
      const Z = new Zettings();
      const mock1: Source = {name: "1", get: (a: string[]) => "one"  };
      const mock2: Source = {name: "2", get: (a: string[]) => "two"  };
      const mock3: Source = {name: "3", get: (a: string[]) => "three"};

      Z.addSource(mock1, 10);
      expect(Z.get("a")).to.be.equals("one");

      Z.addSource(mock2, 11);
      expect(Z.get("a")).to.be.equals("one");

      Z.addSource(mock3, 9);
      expect(Z.get("a")).to.be.equals("three");

      const spMock1 = spy(mock1, "get");
      const spMock3 = spy(mock3, "get");

      Z.get("a");
      expect(spMock1.notCalled).to.be.true;
      expect(spMock3.called).to.be.true;
    });


    it("Assert that #set throws an error when there're no source implementing it.", function() {
      const Z = new Zettings();
      Z.changeProfile('profile_with_no_sources');
      expect(() => {Z.set('key', 'value')}).to.throw(Error);
    });
  });  

  
  it('Assert that there are default sources configured.', function() {
    const Z = new Zettings({});
    expect(Z.count()).to.be.greaterThan(0);
  });


  it("Assert that default sources can be disabled.", function() {
    const Z = new Zettings({
      defaultEnvSource: false,
      defaultMemoSource: false,
    });

    expect(Z.count()).to.be.equals(0);
  });
  

});

