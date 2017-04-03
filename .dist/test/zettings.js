"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const zettings_1 = require("../src/zettings");
const simple_logger_1 = require("../src/utils/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
const pwd = { pwd: '' };
describe("Zettings", function () {
    describe(".addSource & .count & .addValueResolver", function () {
        it("Assert that source names are unique per profile.", function () {
            const Z = new zettings_1.default(pwd);
            const mock = { get: (key) => { return 1; }, name: "mock" };
            Z.addSource(mock);
            chai_1.expect(() => { Z.addSource(mock); }).to.throw(Error);
            Z.addSource(mock, 'other_profile');
            chai_1.expect(() => { Z.addSource(mock, 'other_profile'); }).to.throw(Error);
        });
        it("Assert that the keyword 'total' can't be used as a profile", function () {
            const Z = new zettings_1.default(pwd);
            const mock = { get: (key) => { return 1; }, name: "mock" };
            chai_1.expect(() => { Z.addSource(mock, 'total'); }).to.throw(Error);
        });
        it("Assert that #count works per profile.", function () {
            const Z = new zettings_1.default(pwd);
            const count = Z.count();
            const mock1 = { name: "1", get: (a) => null };
            const mock2 = { name: "2", get: (a) => null };
            const mock3 = { name: "3", get: (a) => null };
            chai_1.expect(Z.count()).to.be.equals(count);
            Z.addSource(mock1);
            chai_1.expect(Z.count()).to.be.equals(count + 1);
            Z.addSource(mock2);
            Z.addSource(mock3);
            chai_1.expect(Z.count()).to.be.equals(count + 3);
        });
        it("Assert that #addValueResolver is being applied on #get", function () {
            const Z = new zettings_1.default(pwd);
            Z.addValueResolver({ name: "any", canResolve: () => true, resolve: () => 'ok' });
            Z.addSource({ get: () => "value", name: 'any' });
            chai_1.expect(Z.getf('-')).to.be.equals('ok');
        });
    });
    describe(".getf & .set", function () {
        it("Assert that the source's #get method receives the key as a token array.", function () {
            const Z = new zettings_1.default(pwd);
            const mock = { get: (key) => { return 1; }, name: "mock" };
            const spGet = sinon_1.spy(mock, "get");
            Z.addSource(mock);
            Z.getf("key[2].with.multiple[5][3][4].sections");
            chai_1.expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);
            spGet.restore();
        });
        it("Assert that sources with no matching profiles won't be used to retrieve values.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { get: (key) => { return 1; }, name: "1" };
            const mock2 = { get: (key) => { return 2; }, name: "2" };
            Z.addSource(mock1, 'profile_one');
            Z.addSource(mock2, 'profile_two');
            chai_1.expect(Z.getf('key')).to.not.be.ok;
            Z.changeProfile('profile_one');
            chai_1.expect(Z.getf('key')).to.be.equals(1);
            Z.changeProfile('profile_two');
            chai_1.expect(Z.getf('key')).to.be.equals(2);
            Z.changeProfile(Z.DEF_PROFILE);
            chai_1.expect(Z.getf('key')).to.not.be.ok;
        });
        it("Assert that #getf returns the default value.", function () {
            const Z = new zettings_1.default(pwd);
            chai_1.expect(Z.getf('none', 1)).to.be.equals(1);
        });
        it("Assert that #getf calls the source with highest priority first.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: (a) => "one" };
            const mock2 = { name: "2", get: (a) => "two" };
            const mock3 = { name: "3", get: (a) => "three" };
            Z.addSource(mock1, 10);
            chai_1.expect(Z.getf("a")).to.be.equals("one");
            Z.addSource(mock2, 11);
            chai_1.expect(Z.getf("a")).to.be.equals("one");
            Z.addSource(mock3, 9);
            chai_1.expect(Z.getf("a")).to.be.equals("three");
            const spMock1 = sinon_1.spy(mock1, "get");
            const spMock3 = sinon_1.spy(mock3, "get");
            Z.getf("a");
            chai_1.expect(spMock1.notCalled).to.be.true;
            chai_1.expect(spMock3.called).to.be.true;
        });
        it("Assert that #set throws an error when there're no sources implementing it.", function () {
            const Z = new zettings_1.default(pwd);
            Z.changeProfile('profile_with_no_sources');
            chai_1.expect(() => { Z.set('key', 'value'); }).to.throw(Error);
        });
    });
    describe(".getm", function () {
        it("Assert that #getm will merge objects from multiple sources.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: (a) => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: (a) => { return { 'key2': 'b' }; } };
            const mock3 = { name: "3", get: (a) => { return { 'key3': 'c' }; } };
            Z.addSource(mock1);
            Z.addSource(mock2);
            Z.addSource(mock3);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a', 'key2': 'b', 'key3': 'c' });
        });
        it("Assert that #getm will merge sources based on its priority.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: (a) => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: (a) => { return { 'key1': 'b' }; } };
            const mock3 = { name: "3", get: (a) => { return { 'key1': 'c' }; } };
            Z.addSource(mock1, 11);
            Z.addSource(mock2, 10);
            Z.addSource(mock3, 12);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'b' });
        });
        it("Assert that #getm merge only objects.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: (a) => { return { 'key1': 'a' }; } };
            const mock2 = { name: "2", get: (a) => 'non-object' };
            Z.addSource(mock1, 11);
            Z.addSource(mock2, 12);
            chai_1.expect(Z.getm('a')).to.be.deep.equals({ 'key1': 'a' });
        });
        it("Assert that #getm doesn't search other sources when the first one returns a primitive value.", function () {
            const Z = new zettings_1.default(pwd);
            const get = sinon_1.spy((a) => 'non-object');
            const mock1 = { name: "1", get: (a) => 'first-value' };
            const mock2 = { name: "2", get: get };
            Z.getm('a');
            chai_1.expect(get.notCalled).to.be.true;
        });
        it("Assert that #getm retrieve values from the source with highest priority.", function () {
            const Z = new zettings_1.default(pwd);
            const mock1 = { name: "1", get: (a) => "one" };
            const mock2 = { name: "2", get: (a) => "two" };
            const mock3 = { name: "3", get: (a) => "three" };
            Z.addSource(mock1, 10);
            chai_1.expect(Z.getm("a")).to.be.equals("one");
            Z.addSource(mock2, 11);
            chai_1.expect(Z.getm("a")).to.be.equals("one");
            Z.addSource(mock3, 9);
            chai_1.expect(Z.getm("a")).to.be.equals("three");
            const spMock1 = sinon_1.spy(mock1, "get");
            const spMock3 = sinon_1.spy(mock3, "get");
            Z.getf("a");
            chai_1.expect(spMock1.notCalled).to.be.true;
            chai_1.expect(spMock3.called).to.be.true;
        });
    });
    it('Assert that there are default sources configured.', function () {
        const Z = new zettings_1.default(pwd);
        chai_1.expect(Z.count()).to.be.greaterThan(0);
    });
    it("Assert that default sources can be disabled.", function () {
        const Z = new zettings_1.default({
            defaultEnvSource: false,
            defaultMemoSource: false,
            pwd: ''
        });
        chai_1.expect(Z.count()).to.be.equals(0);
    });
});
//# sourceMappingURL=zettings.js.map