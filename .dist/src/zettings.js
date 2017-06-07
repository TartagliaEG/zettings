"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import VrDeepRef from './value-resolver/vr-deep-reference';
const vr_map_1 = require("./value-resolver/vr-map");
const src_env_1 = require("./sources/src-env");
const src_memory_1 = require("./sources/src-memory");
const simple_logger_1 = require("./utils/simple-logger");
const vr_reference_1 = require("./value-resolver/vr-reference");
const type_check_1 = require("./utils/type-check");
const node_iteration_1 = require("./utils/node-iteration");
const _ = require("lodash");
const Log = new simple_logger_1.default('Zettings');
class Zettings {
    /**
     * @see Options
     */
    constructor(options) {
        /** List of configured Sources **/
        this.sources = [];
        /** List of value resolvers to be applied each time the get is called */
        this.valueResolvers = [];
        /** Stores the names already used **/
        this.nameKeys = {};
        /** Stores the number of registered sources */
        this.counter = 0;
        this.lowestPriority = 0;
        this.pwd = options.pwd;
        options.defaultMemoSource = getFirstValid(options.defaultMemoSource, true);
        options.defaultEnvSource = getFirstValid(options.defaultEnvSource, true);
        options.defaultVrReference = getFirstValid(options.defaultVrReference, true);
        options.defaultVrMap = getFirstValid(options.defaultVrMap, true);
        this.expTokens = getFirstValid(options.expressionTokens, { open: '${', close: '}' });
        let memoPriority = getFirstValid(options.defaultMemoSourcePriority, 1);
        let envPriority = getFirstValid(options.defaultEnvSourcePriority, 5);
        if (options.defaultMemoSource)
            this.addSource(new src_memory_1.default({}), memoPriority);
        if (options.defaultEnvSource)
            this.addSource(new src_env_1.default(), envPriority);
        if (options.defaultVrReference)
            this.addValueResolver(new vr_reference_1.default({ pwd: this.pwd }));
        if (options.defaultVrMap) {
            const map = new Map();
            map.set('pwd', this.pwd);
            this.addValueResolver(new vr_map_1.default({ map: map }));
        }
        if (!this.expTokens || !type_check_1.isString(this.expTokens.open) || !type_check_1.isString(this.expTokens.close))
            throw new Error("Invalid expression tokens. Expected: { open: <string>, close: <string> }, but found: " + JSON.stringify(this.expTokens) + ". ");
    }
    /**
     * Add a ValueResolver to be applied each time the #get function is called.
     *
     * @param {ValueResolver} resolver - The resolver instance.
     **/
    addValueResolver(resolver) {
        Log.i("New value resolver ->  { name: '" + resolver.name + "' }");
        this.valueResolvers.push(resolver);
    }
    /**
     * @see addSource(source: Source): void;
     * @see addSource(source: Source, priority: number): void;
     */
    addSource(source, priority) {
        if (priority === undefined) {
            priority = this.lowestPriority + 1;
        }
        else if (typeof priority !== 'number') {
            throw Error('Invalid parameters. Expected priority to be a number, but found: ' + typeof priority + '.');
        }
        this.lowestPriority = priority > this.lowestPriority ? priority : this.lowestPriority;
        this.counter++;
        if (this.nameKeys[source.name])
            throw new Error("The name '" + source.name + "' is being used already.");
        this.nameKeys[source.name] = true;
        Log.i("New source added ->  { name: '" + source.name + "', priority: '" + priority + "' }");
        this.sources.push({ priority: priority, source: source, enabled: true });
        this.sources = this.sources.sort((sourceA, sourceB) => {
            return sourceA.priority - sourceB.priority;
        });
    }
    /**
     * Retrieve the number of registered sources.
     */
    count() {
        return this.counter;
    }
    /**
     * [get-merged]:
     *
     * Retrieve the value associated with the given key. If the first source returns a primitive or an array, it will be returned.
     * Otherwise, if the first source returns an object, the other source will be queried and have its results merged. The properties
     * from the first source found have higher priority. If the other sources return primitives or arrays, they will be ignored.
     *
     * @param {string} key - The key whose associated value is to be returned.
     * @param {any} [def]  - A default value used when no value was found.
     */
    getm(key, def) {
        const keys = key.replace(/]/g, '').split(/[\[.]/g);
        let result;
        let type;
        for (let i = 0; i < this.sources.length; i++) {
            const prioritySource = this.sources[i];
            const source = prioritySource.source;
            if (!prioritySource.enabled)
                continue;
            let value = source.get(keys);
            if (!type_check_1.isValid(value))
                continue;
            // If the 'type' have not been set yet and the 'value' isn't an object, we can break the loop (primitives and arrays shouldn't be merged).
            if (!type_check_1.isValid(type) && !type_check_1.isObject(value)) {
                result = this.resolveValue(value);
                break;
            }
            value = this.resolveValue(value);
            type = type || typeof value;
            result = result || {};
            if (typeof value !== type)
                continue;
            result = _.merge({}, value, result);
        }
        return result === undefined ? def : result;
    }
    /**
     * Calls refresh in each source, so they could check for configuration changes
     */
    refresh() {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i].source.refresh && this.sources[i].enabled && this.sources[i].source.refresh();
        return this;
    }
    /**
     * Enable/Disable a source. Disabled sources won't be used to retrieve, refresh or set values.
     *
     * @param {string} name - The source name
     * @throws {Error} throws an error if no source is found with the given name.
     */
    toggleSource(name) {
        let found = false;
        for (let i = 0; i < this.sources.length; i++)
            if (this.sources[i].source.name === name) {
                this.sources[i].enabled = !this.sources[i].enabled;
                found = true;
                break;
            }
        if (!found)
            throw new Error("Failed to toggle. No source registered with the name '" + name + "'.");
    }
    resolveValue(value) {
        node_iteration_1.forEachLeaf(value, (leaf, mutate) => {
            let resolvedValue;
            if (typeof leaf === 'string')
                resolvedValue = this.resolveExpressions(leaf);
            else
                resolvedValue = this.applyValueResolvers(leaf);
            if (type_check_1.isPrimitive(value))
                value = resolvedValue;
            else
                mutate(resolvedValue);
            return 'CONTINUE_ITERATION';
        });
        return value;
    }
    resolveExpressions(value) {
        let opnIdx;
        let clsIdx;
        let open = this.expTokens.open;
        let close = this.expTokens.close;
        let temp;
        while ((opnIdx = value.lastIndexOf(open)) >= 0) {
            temp = value.slice(opnIdx + open.length);
            clsIdx = temp.indexOf(close);
            if (clsIdx === -1)
                throw new Error("An openning token was found at col " + opnIdx + " without its closing pair: ('" + value + "'). ");
            temp = temp.slice(0, clsIdx);
            value = value.substr(0, opnIdx) + this.applyValueResolvers(temp) + value.substr(opnIdx + open.length + clsIdx + 1);
        }
        return value;
    }
    /**
     * Iterate over all value resolver and apply those that can handle the value.
     *
     * @param {any} value - the value to be resolved.
     */
    applyValueResolvers(value) {
        for (let i = 0; i < this.valueResolvers.length; i++) {
            const resolver = this.valueResolvers[i];
            if (resolver.canResolve(value))
                return resolver.resolve(value);
        }
        return value;
    }
    /**
     * Associate the value with the given key.
     *
     * @param {string} key - The mapping key
     * @param {any} value  - The value to be saved
     * @throws {Error}     - An error will be thrown if there is no source that handles this operation
     */
    set(key, value) {
        let keys = key.replace(/]/g, '').split(/[\[.]/g);
        let isSetSupported = false;
        for (let i = 0; i < this.sources.length; i++) {
            const prioritySource = this.sources[i];
            const source = prioritySource.source;
            if (!prioritySource.enabled)
                continue;
            if (typeof source.set == "function") {
                isSetSupported = true;
                source.set(keys, value);
            }
        }
        if (!isSetSupported)
            throw new Error("There is no source configured that implements the 'set' method");
    }
}
exports.default = Zettings;
function getFirstValid(...values) {
    for (let i = 0; i < values.length; i++) {
        if (values[i] != undefined && values[i] != null)
            return values[i];
    }
}
exports.getFirstValid = getFirstValid;
//# sourceMappingURL=zettings.js.map