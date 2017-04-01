"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_env_1 = require("./sources/src-env");
const src_memory_1 = require("./sources/src-memory");
const simple_logger_1 = require("./utils/simple-logger");
const tr_function_1 = require("./value-transformations/tr-function");
const tr_object_1 = require("./value-transformations/tr-object");
const Log = new simple_logger_1.default('Zettings');
class Zettings {
    constructor(options) {
        this.DEF_PROFILE = 'DEFAULT_PROFILE';
        this.sources = [];
        this.transformations = [];
        this.nameKeys = {};
        this.counter = { total: 0 };
        this.profile = options.profile || this.DEF_PROFILE;
        this.lowestPriority = 0;
        this.pwd = options.pwd;
        options.defaultMemoSource = getFirstValid(options.defaultMemoSource, true);
        options.defaultEnvSource = getFirstValid(options.defaultEnvSource, true);
        options.defaultTrFunction = getFirstValid(options.defaultTrFunction, true);
        options.defaultTrObject = getFirstValid(options.defaultTrObject, true);
        let memoPriority = getFirstValid(options.defaultMemoSourcePriority, 1);
        let envPriority = getFirstValid(options.defaultEnvSourcePriority, 5);
        if (options.defaultMemoSource)
            this.addSource(new src_memory_1.default({}), memoPriority, this.profile);
        if (options.defaultEnvSource)
            this.addSource(new src_env_1.default(), envPriority, this.profile);
        if (options.defaultTrFunction)
            this.addTransformation(new tr_function_1.default({ pwd: this.pwd }));
        if (options.defaultTrObject)
            this.addTransformation(new tr_object_1.default({ pwd: this.pwd }));
    }
    addTransformation(transformation) {
        this.transformations.push(transformation);
    }
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
    count(profile) {
        profile = profile || 'total';
        return this.counter[profile] || 0;
    }
    changeProfile(profile) {
        this.profile = profile;
    }
    get(key, def) {
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
        result = result === undefined ? def : result;
        this.transformations.some((transformation) => {
            if (transformation.pattern.test(result)) {
                result = transformation.transform(result);
                return true;
            }
            return false;
        });
        return result;
    }
    getf(key, def) {
        const value = this.get(key, def);
        if (value == undefined || value == null)
            throw new Error("No available setting for key '" + key + "'");
        return value;
    }
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
//# sourceMappingURL=zettings.js.map