"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const zettings_1 = require("../src/zettings");
const simple_logger_1 = require("../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
const pwd = { pwd: '' };
describe("Zettings", function () {
    describe(".addSource", function () {
        it("Should ensure that the name and priority pair are  source names are unique.", function () {
            const Z = new zettings_1.default(pwd);
            const fakeSource = { get: () => { return 1; }, name: "mock" };
            Z.addSource(fakeSource);
            chai_1.expect(() => { Z.addSource(fakeSource); }).to.throw(Error);
        });
    });
    describe(".count", function () {
        it("Should return the number of registered sources.", function () {
            const Z = new zettings_1.default(pwd);
            const count = Z.count();
            const mock1 = { name: "1", get: () => null };
            const mock2 = { name: "2", get: () => null };
            const mock3 = { name: "3", get: () => null };
            chai_1.expect(Z.count()).to.be.equals(count);
            Z.addSource(mock1);
            chai_1.expect(Z.count()).to.be.equals(count + 1);
            Z.addSource(mock2);
            Z.addSource(mock3);
            chai_1.expect(Z.count()).to.be.equals(count + 3);
        });
    });
    describe(".addValueResolver", function () {
        it("Should use the new configured value resolver", function () {
            const Z = new zettings_1.default(pwd);
            Z.addValueResolver({ name: "any", canResolve: () => true, resolve: () => 'ok' });
            Z.addSource({ get: () => "${replace this value by the word ok}", name: 'any' });
            chai_1.expect(Z.getm('-')).to.be.equals('ok');
        });
    });
    describe(".getm", function () {
        it("Should call the source's get method with the split keys as arguments.", function () {
            const Z = new zettings_1.default(pwd);
            const mock = { get: () => { return 1; }, name: "mock" };
            const spGet = sinon_1.spy(mock, "get");
            Z.addSource(mock);
            Z.getm("key[2].with.multiple[5][3][4].sections");
            chai_1.expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);
            spGet.restore();
        });
        it("If no sources contains the given key, it should return the default value (second parameter).", function () {
            const Z = new zettings_1.default(pwd);
            chai_1.expect(Z.getm('none', 1)).to.be.equals(1);
        });
        it("Should calls the source with highest priority first.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: () => "one" };
            const mock2 = { name: "2", get: () => "two" };
            const mock3 = { name: "3", get: () => "three" };
            Z.addSource(mock1, 10);
            chai_1.expect(Z.getm("a")).to.be.equals("one");
            Z.addSource(mock2, 11);
            chai_1.expect(Z.getm("a")).to.be.equals("one");
            Z.addSource(mock3, 9);
            chai_1.expect(Z.getm("a")).to.be.equals("three");
            const spMock1 = sinon_1.spy(mock1, "get");
            const spMock3 = sinon_1.spy(mock3, "get");
            Z.getm("a");
            chai_1.expect(spMock1.notCalled).to.be.true;
            chai_1.expect(spMock3.called).to.be.true;
        });
        it("Should ignore disabled sources.", function () {
            const Z = new zettings_1.default({ pwd: '', defaultEnvSource: false, defaultMemoSource: false });
            const mock1 = { name: "1", get: () => "one" };
            const mock2 = { name: "2", get: () => "two" };
            const mock3 = { name: "3", get: () => "three" };
            Z.addSource(mock1, 1);
            Z.addSource(mock2, 2);
            Z.addSource(mock3, 3);
            chai_1.expect(Z.getm('a')).to.be.equals('one');
            Z.toggleSource('1');
            chai_1.expect(Z.getm('a')).to.be.equals('two');
            Z.toggleSource('2');
            chai_1.expect(Z.getm('a')).to.be.equals('three');
            Z.toggleSource('3');
            chai_1.expect(Z.getm('a')).to.be.equals(undefined);
            Z.toggleSource('1');
            chai_1.expect(Z.getm('a')).to.be.equals('one');
        });
        it("Should merge objects from multiple sources.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: () => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: () => { return { 'key2': 'b' }; } };
            const mock3 = { name: "3", get: () => { return { 'key3': 'c' }; } };
            Z.addSource(mock1);
            Z.addSource(mock2);
            Z.addSource(mock3);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a', 'key2': 'b', 'key3': 'c' });
        });
        it("Should merge sources based on its priority.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: () => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: () => { return { 'key1': 'b' }; } };
            const mock3 = { name: "3", get: () => { return { 'key1': 'c' }; } };
            Z.addSource(mock1, 11);
            Z.addSource(mock2, 10);
            Z.addSource(mock3, 12);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'b' });
        });
        it("Should merge only objects.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: () => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: () => 'non-object' };
            Z.addSource(mock1, 11);
            Z.addSource(mock2, 12);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a' });
        });
        it("Shouldn't query other sources when the first one has returned a non-mergeable value already.", function () {
            const Z = new zettings_1.default(pwd);
            const get = sinon_1.spy(() => 'non-object');
            const mock1 = { name: "1", get: () => 'first-value' };
            const mock2 = { name: "2", get: get };
            Z.addSource(mock1);
            Z.addSource(mock2);
            Z.getm('a');
            chai_1.expect(get.notCalled).to.be.true;
        });
    });
    describe(".set", function () {
        it("Should throw an error when there're no sources implementing the set method.", function () {
            const Z = new zettings_1.default({ defaultEnvSource: false, defaultMemoSource: false, pwd: 'a' });
            chai_1.expect(() => { Z.set('key', 'value'); }).to.throw(Error);
        });
        it("Should ignore disabled sources.", function () {
            const Z = new zettings_1.default({ pwd: '', defaultEnvSource: false, defaultMemoSource: false });
            const mock1 = { name: "1", set: sinon_1.stub(), get: sinon_1.stub() };
            const mock2 = { name: "2", set: sinon_1.stub(), get: sinon_1.stub() };
            const mock3 = { name: "3", set: sinon_1.stub(), get: sinon_1.stub() };
            Z.addSource(mock1, 1);
            Z.addSource(mock2, 2);
            Z.addSource(mock3, 3);
            Z.set('testKey', 10);
            chai_1.expect(mock1.set.calledOnce).to.be.true;
            chai_1.expect(mock2.set.calledOnce).to.be.true;
            chai_1.expect(mock3.set.calledOnce).to.be.true;
            chai_1.expect(mock1.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
            chai_1.expect(mock2.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
            chai_1.expect(mock3.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
            Z.toggleSource('1');
            Z.toggleSource('3');
            Z.set('otherKey', 11);
            chai_1.expect(mock1.set.calledOnce).to.be.true;
            chai_1.expect(mock2.set.calledTwice).to.be.true;
            chai_1.expect(mock3.set.calledOnce).to.be.true;
            chai_1.expect(mock1.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
            chai_1.expect(mock2.set.getCall(1).args).to.be.deep.equals([['otherKey'], 11]);
            chai_1.expect(mock3.set.getCall(0).args).to.be.deep.equals([['testKey'], 10]);
        });
    });
    describe("(defaults)", function () {
        it('Should have default sources configured.', function () {
            const Z = new zettings_1.default(pwd);
            chai_1.expect(Z.count()).to.be.greaterThan(0);
        });
        it("Should disable default sources.", function () {
            const Z = new zettings_1.default({
                defaultEnvSource: false,
                defaultMemoSource: false,
                pwd: ''
            });
            chai_1.expect(Z.count()).to.be.equals(0);
        });
    });
});
//# sourceMappingURL=zettings.js.map