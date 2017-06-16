import { expect } from "chai";
import { stub, spy } from "sinon";
import Zettings from "../src/zettings";
import { Source } from "../src/types";
import { setLoggerLevel, LVL_NONE } from '../src/utils/simple-logger';

setLoggerLevel(LVL_NONE);
const pwd = { pwd: '' };

describe("Zettings", function () {

  describe(".addSource", function () {
    it("Should ensure that the name and priority pair are  source names are unique.", function () {
      const Z = new Zettings(pwd);
      const fakeSource: Source = { get: (): any => { return 1; }, name: "mock" };

      Z.addSource(fakeSource);
      expect(() => { Z.addSource(fakeSource) }).to.throw(Error);
    });
  });


  describe(".count", function () {
    it("Should return the number of registered sources.", function () {
      const Z = new Zettings(pwd);
      const count = Z.count();
      const mock1: Source = { name: "1", get: () => null };
      const mock2: Source = { name: "2", get: () => null };
      const mock3: Source = { name: "3", get: () => null };

      expect(Z.count()).to.be.equals(count);

      Z.addSource(mock1);
      expect(Z.count()).to.be.equals(count + 1);

      Z.addSource(mock2);
      Z.addSource(mock3);
      expect(Z.count()).to.be.equals(count + 3);
    });
  });


  describe(".addValueResolver", function () {
    it("Should use the new configured value resolver", function () {
      const Z = new Zettings(pwd);
      Z.addValueResolver({ name: "any", canResolve: () => true, resolve: () => 'ok' });
      Z.addSource({ get: () => "${replace this value by the word ok}", name: 'any' });
      expect(Z.getm('-')).to.be.equals('ok');
    });
  });


  describe(".getm", function () {
    it("Should call the source's get method with the split keys as arguments.", function () {
      const Z = new Zettings(pwd);
      const mock: Source = { get: (): any => { return 1; }, name: "mock" };

      const spGet = spy(mock, "get");

      Z.addSource(mock);
      Z.getm("key[2].with.multiple[5][3][4].sections");
      expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);

      spGet.restore();
    });


    it("If no sources contains the given key, it should return the default value (second parameter).", function () {
      const Z = new Zettings(pwd);

      expect(Z.getm('none', 1)).to.be.equals(1);
    });


    it("Should calls the source with highest priority first.", function () {
      const Z = new Zettings(pwd);
      const mock1: Source = { name: "1", get: () => "one" };
      const mock2: Source = { name: "2", get: () => "two" };
      const mock3: Source = { name: "3", get: () => "three" };

      Z.addSource(mock1, 10);
      expect(Z.getm("a")).to.be.equals("one");

      Z.addSource(mock2, 11);
      expect(Z.getm("a")).to.be.equals("one");

      Z.addSource(mock3, 9);
      expect(Z.getm("a")).to.be.equals("three");

      const spMock1 = spy(mock1, "get");
      const spMock3 = spy(mock3, "get");

      Z.getm("a");
      expect(spMock1.notCalled).to.be.true;
      expect(spMock3.called).to.be.true;
    });


    it("Should ignore disabled sources.", function () {
      const Z = new Zettings({ pwd: '', defaultEnvSource: false, defaultMemoSource: false });
      const mock1: Source = { name: "1", get: () => "one" };
      const mock2: Source = { name: "2", get: () => "two" };
      const mock3: Source = { name: "3", get: () => "three" };

      Z.addSource(mock1, 1);
      Z.addSource(mock2, 2);
      Z.addSource(mock3, 3);

      expect(Z.getm('a')).to.be.equals('one');

      Z.toggleSource('1');
      expect(Z.getm('a')).to.be.equals('two');

      Z.toggleSource('2');
      expect(Z.getm('a')).to.be.equals('three');

      Z.toggleSource('3');
      expect(Z.getm('a')).to.be.equals(undefined);

      Z.toggleSource('1');
      expect(Z.getm('a')).to.be.equals('one');
    });


    it("Should merge objects from multiple sources.", function () {
      const Z = new Zettings(pwd);
      const mock1: Source = { name: "1", get: () => { return { 'key1': 'a' } } };
      const mock2: Source = { name: "2", get: () => { return { 'key2': 'b' } } };
      const mock3: Source = { name: "3", get: () => { return { 'key3': 'c' } } };

      Z.addSource(mock1);
      Z.addSource(mock2);
      Z.addSource(mock3);

      expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a', 'key2': 'b', 'key3': 'c' });
    });


    it("Should merge sources based on its priority.", function () {
      const Z = new Zettings(pwd);
      const mock1: Source = { name: "1", get: () => { return { 'key1': 'a' } } };
      const mock2: Source = { name: "2", get: () => { return { 'key1': 'b' } } };
      const mock3: Source = { name: "3", get: () => { return { 'key1': 'c' } } };

      Z.addSource(mock1, 11);
      Z.addSource(mock2, 10);
      Z.addSource(mock3, 12);

      expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'b' });
    });


    it("Should merge only objects.", function () {
      const Z = new Zettings(pwd);
      const mock1: Source = { name: "1", get: () => { return { 'key1': 'a' } } };
      const mock2: Source = { name: "2", get: () => 'non-object' };

      Z.addSource(mock1, 11);
      Z.addSource(mock2, 12);

      expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a' });
    });


    it("Shouldn't query other sources when the first one has returned a non-mergeable value already.", function () {
      const Z = new Zettings(pwd);
      const get = spy(() => 'non-object');
      const mock1: Source = { name: "1", get: () => 'first-value' };
      const mock2: Source = { name: "2", get: get };

      Z.addSource(mock1);
      Z.addSource(mock2);

      Z.getm('a');

      expect(get.notCalled).to.be.true;
    });
  });


  describe(".set", function () {
    it("Should throw an error when there're no sources implementing the set method.", function () {
      const Z = new Zettings({ defaultEnvSource: false, defaultMemoSource: false, pwd: 'a' });
      expect(() => { Z.set('key', 'value') }).to.throw(Error);
    });

    it("Should ignore disabled sources.", function () {
      const Z = new Zettings({ pwd: '', defaultEnvSource: false, defaultMemoSource: false });
      const mock1 = { name: "1", set: stub(), get: stub() };
      const mock2 = { name: "2", set: stub(), get: stub() };
      const mock3 = { name: "3", set: stub(), get: stub() };

      Z.addSource(mock1, 1);
      Z.addSource(mock2, 2);
      Z.addSource(mock3, 3);

      Z.set('testKey', 10);

      expect(mock1.set.calledOnce).to.be.true;
      expect(mock2.set.calledOnce).to.be.true;
      expect(mock3.set.calledOnce).to.be.true;

      expect(mock1.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
      expect(mock2.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
      expect(mock3.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);

      Z.toggleSource('1');
      Z.toggleSource('3');

      Z.set('otherKey', 11);

      expect(mock1.set.calledOnce).to.be.true;
      expect(mock2.set.calledTwice).to.be.true;
      expect(mock3.set.calledOnce).to.be.true;

      expect(mock1.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
      expect(mock2.set.getCall(1).args).to.be.deep.equals([['otherKey'], 11]);
      expect(mock3.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
    });
  });


  describe("(defaults)", function () {
    it('Should have default sources configured.', function () {
      const Z = new Zettings(pwd);
      expect(Z.count()).to.be.greaterThan(0);
    });


    it("Should disable default sources.", function () {
      const Z = new Zettings({
        defaultEnvSource: false,
        defaultMemoSource: false,
        pwd: ''
      });

      expect(Z.count()).to.be.equals(0);
    });
  });

});
