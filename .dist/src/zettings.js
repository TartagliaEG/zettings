"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_env_1 = require("./sources/src-env");
const src_memory_1 = require("./sources/src-memory");
const simple_logger_1 = require("./utils/simple-logger");
const vr_reference_1 = require("./value-resolver/vr-reference");
const type_check_1 = require("./utils/type-check");
const _ = require("lodash");
const Log = new simple_logger_1.default('Zettings');
class Zettings {
    /**
     * @see Options
     */
    constructor(options) {
        this.DEF_PROFILE = 'DEFAULT_PROFILE';
        /** List of configured Sources **/
        this.sources = [];
        /** List of value resolvers to be applied each time the get is called */
        this.valueResolvers = [];
        /** Stores the names already used per profiles **/
        this.nameKeys = {};
        /** Stores the number of sources per profile */
        this.counter = { total: 0 };
        this.profile = options.profile || this.DEF_PROFILE;
        this.lowestPriority = 0;
        this.pwd = options.pwd;
        options.defaultMemoSource = getFirstValid(options.defaultMemoSource, true);
        options.defaultEnvSource = getFirstValid(options.defaultEnvSource, true);
        options.defaultVrReference = getFirstValid(options.defaultVrReference, true);
        options.defaultVrDeepRef = getFirstValid(options.defaultVrDeepRef, true);
        let memoPriority = getFirstValid(options.defaultMemoSourcePriority, 1);
        let envPriority = getFirstValid(options.defaultEnvSourcePriority, 5);
        if (options.defaultMemoSource)
            this.addSource(new src_memory_1.default({}), memoPriority, this.profile);
        if (options.defaultEnvSource)
            this.addSource(new src_env_1.default(), envPriority, this.profile);
        if (options.defaultVrReference)
            this.addValueResolver(new vr_reference_1.default({ pwd: this.pwd }));
        if (options.defaultVrDeepRef)
            this.addValueResolver(new vr_deep_reference_1.default({ pwd: this.pwd }));
    }
    /**
     * Add a ValueResolver to be applied each time the #get function is called.
     *
     * @param {ValueResolver} resolver - The resolver instance.
     **/
    addValueResolver(resolver) {
        this.valueResolvers.push(resolver);
    }
    /**
     * @see addSource(source: Source): void;
     * @see addSource(source: Source, profile: string): void;
     * @see addSource(source: Source, priority: number): void;
     * @see addSource(source: Source, priority: number, profile: string): void;
     */
    addSource(source, priority, profile) {
        if (priority === undefined && profile === undefined) {
            priority = this.lowestPriority + 1;
            profile = this.profile;
        }
        else if (typeof priority === 'string' && profile === undefined) {
            profile = priority;
            priority = this.lowestPriority + 1;
        }
        else if (typeof priority === 'number' && profile === undefined) {
            profile = this.profile;
        }
        else if (typeof priority !== 'number' || typeof profile !== 'string') {
            throw Error('Invalid parameters. Expected (Object, [number, string]) or (Object, [number|string]) but found (' + typeof source + ', ' + typeof priority + ', ' + typeof profile + ')');
        }
        if (profile === 'total') {
            throw new Error("'total' is a reserver keyword and can't be used as a profile.");
        }
        this.lowestPriority = priority > this.lowestPriority ? priority : this.lowestPriority;
        this.counter[profile] = this.counter[profile] || 0;
        this.counter[profile]++;
        this.counter['total']++;
        const composedName = profile + ':' + source.name;
        if (this.nameKeys[composedName]) {
            throw new Error("The name '" + source.name + "' already exists in the '" + profile + "' profile");
        }
        this.nameKeys[composedName] = true;
        Log.d("New source added ->  { name: '" + source.name + "', profile: '" + profile + "' }");
        this.sources.push({ priority: priority, profile, source: source });
        this.sources = this.sources.sort((sourceA, sourceB) => {
            return sourceA.priority - sourceB.priority;
        });
    }
    /**
     * Retrieve the number of sources associated with the given profile.
     *
     * @param {string} [profile] - The profile. defaults to "total".
     */
    count(profile) {
        profile = profile || 'total';
        return this.counter[profile] || 0;
    }
    /**
     * Change the current configured profile. Only Sources added with the given profile will be used.
     * @param {string} profile The new profile.
     */
    changeProfile(profile) {
        this.profile = profile;
    }
    /**
     * Retrieve the value associated with the given key from the first matching source.
     *
     * @param {string} key - The key whose associated value is to be returned.
     * @param {any} [def]  - A default value used when no value was found.
     */
    getf(key, def) {
        let keys = key.replace(/]/g, '').split(/[\[.]/g);
        let result;
        for (let i = 0; i < this.sources.length; i++) {
            const prioritySource = this.sources[i];
            const source = prioritySource.source;
            if (prioritySource.profile !== this.profile)
                continue;
            const value = source.get(keys);
            if (value === undefined)
                continue;
            result = value;
            break;
        }
        return this.resolveValue(result, def);
    }
    /**
     * Retrieve the value associated with the given key. If the first source returns a primitive or an array, it will be returned.
     * Otherwise, if the first source returns an object, the other source will be queried and have its results merged. The properties
     * from the first source have higher priority. If the other sources return primitives or arrays, they will be ignored.
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
            if (prioritySource.profile !== this.profile)
                continue;
            const value = source.get(keys);
            if (!type_check_1.isValid(value))
                continue;
            // If the 'type' has not been set yet and the value isn't an object, we can break the loop (primitives and arrays won't be merged).
            if (!type_check_1.isValid(type) && !type_check_1.isObject(value)) {
                result = this.resolveValue(value, def);
                break;
            }
            type = type || typeof value;
            result = result || {};
            if (typeof value !== type)
                continue;
            result = _.merge({}, value, result);
        }
        return result;
    }
    resolveValue(value, def) {
        this.valueResolvers.some((resolver) => {
            if (resolver.canResolve(value)) {
                value = resolver.resolve(value);
                return true;
            }
            return false;
        });
        return value === undefined ? def : value;
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
            if (typeof source.set == "function" && this.profile == prioritySource.profile) {
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
const vr_deep_reference_1 = require("./value-resolver/vr-deep-reference");
const v = new vr_deep_reference_1.default({ pwd: __dirname + '/../test/value-resolver/' });
v.resolve({ root: '${ref=./vr-reference-mock}' });
//# sourceMappingURL=zettings.js.map