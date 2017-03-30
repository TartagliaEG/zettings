"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const zettings_1 = require("../src/zettings");
const simple_logger_1 = require("../src/simple-logger");
simple_logger_1.setLoggerLevel(simple_logger_1.LVL_NONE);
describe("Zettings", function () {
    describe(".addSource & .count", function () {
        it("Assert that source names are unique per profile.", function () {
            const Z = new zettings_1.default();
            const mock = { get: (key) => { return 1; }, name: "mock" };
            Z.addSource(mock);
            chai_1.expect(() => { Z.addSource(mock); }).to.throw(Error);
            Z.addSource(mock, 'other_profile');
            chai_1.expect(() => { Z.addSource(mock, 'other_profile'); }).to.throw(Error);
        });
        it("Assert that the keyword 'total' can't be used as a profile", function () {
            const Z = new zettings_1.default();
            const mock = { get: (key) => { return 1; }, name: "mock" };
            chai_1.expect(() => { Z.addSource(mock, 'total'); }).to.throw(Error);
        });
        it("Assert that #count works per profile.", function () {
            const Z = new zettings_1.default();
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
    });
    describe(".get & .getf & .set", function () {
        it("Assert that the source's #get method receives the key as a token array.", function () {
            const Z = new zettings_1.default();
            const mock = { get: (key) => { return 1; }, name: "mock" };
            const spGet = sinon_1.spy(mock, "get");
            Z.addSource(mock);
            Z.get("key[2].with.multiple[5][3][4].sections");
            chai_1.expect(spGet.getCall(0).args[0]).to.be.deep.equals(["key", "2", "with", "multiple", "5", "3", "4", "sections"]);
            spGet.restore();
        });
        it("Assert that sources with no matching profiles won't be used to retrieve values.", function () {
            const Z = new zettings_1.default();
            const mock1 = { get: (key) => { return 1; }, name: "1" };
            const mock2 = { get: (key) => { return 2; }, name: "2" };
            Z.addSource(mock1, 'profile_one');
            Z.addSource(mock2, 'profile_two');
            chai_1.expect(Z.get('key')).to.not.be.ok;
            Z.changeProfile('profile_one');
            chai_1.expect(Z.get('key')).to.be.equals(1);
            Z.changeProfile('profile_two');
            chai_1.expect(Z.get('key')).to.be.equals(2);
            Z.changeProfile(Z.DEF_PROFILE);
            chai_1.expect(Z.get('key')).to.not.be.ok;
        });
        it("Assert that #get and #getf returns the default value.", function () {
            const Z = new zettings_1.default();
            chai_1.expect(Z.get('none', 1)).to.be.equals(1);
            chai_1.expect(Z.getf('none', 1)).to.be.equals(1);
        });
        it("Assert that #getf throws an error when the source returns undefined.", function () {
            const Z = new zettings_1.default();
            chai_1.expect(() => { Z.getf("willthrowerror"); }).to.throw(Error);
        });
        it("Assert that #get calls the source with highest priority first.", function () {
            const Z = new zettings_1.default();
            const mock1 = { name: "1", get: (a) => "one" };
            const mock2 = { name: "2", get: (a) => "two" };
            const mock3 = { name: "3", get: (a) => "three" };
            Z.addSource(mock1, 10);
            chai_1.expect(Z.get("a")).to.be.equals("one");
            Z.addSource(mock2, 11);
            chai_1.expect(Z.get("a")).to.be.equals("one");
            Z.addSource(mock3, 9);
            chai_1.expect(Z.get("a")).to.be.equals("three");
            const spMock1 = sinon_1.spy(mock1, "get");
            const spMock3 = sinon_1.spy(mock3, "get");
            Z.get("a");
            chai_1.expect(spMock1.notCalled).to.be.true;
            chai_1.expect(spMock3.called).to.be.true;
        });
        it("Assert that #set throws an error when there're no source implementing it.", function () {
            const Z = new zettings_1.default();
            Z.changeProfile('profile_with_no_sources');
            chai_1.expect(() => { Z.set('key', 'value'); }).to.throw(Error);
        });
    });
    describe("defaults", function () {
        it('Assert that there are default sources configured.', function () {
            const Z = new zettings_1.default({});
            chai_1.expect(Z.count()).to.be.greaterThan(0);
        });
        it("Disable default sources.", function () {
            const Z = new zettings_1.default({
                defaultEnvSource: false,
                defaultMemoSource: false
            });
            chai_1.expect(Z.count()).to.be.equals(0);
        });
    });
});
//# sourceMappingURL=zettings.js.map