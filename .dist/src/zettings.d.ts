export interface Source {
    readonly name: string;
    get(key: string[]): any;
    set?(ket: string[], value: any): void;
}
/**
 * Zettings Options
 */
export interface Options {
    /**
     * Specifies if a default EnvSource should be created.
     * default - true
     */
    defaultEnvSource?: boolean;
    /**
     * Specifies the default EnvSource priority.
     * default - 5
     */
    defaultEnvSourcePriority?: number;
    /**
     * Specifies if a default MemoSource should be created.
     * default - true
     */
    defaultMemoSource?: boolean;
    /**
     * Specifies the default MemoSource priority.
     * default - 1
     */
    defaultMemoSourcePriority?: number;
    /**
     * Specifies if the default reference resolver should be used
     * default - true
     */
    defaultVrReference?: boolean;
    /**
     * Specifies if the default deep reference resolver should be used.
     * default - true
     */
    defaultVrDeepRef?: boolean;
    /**
     * Specifies if the default map resolve should be used. The default map contains only the pwd key.
     * default - true
     */
    defaultVrMap?: boolean;
    /**
     * Specify the working directory
     */
    pwd: string;
}
export interface ValueResolver {
    /**
     * Name used mainly to log info
     */
    readonly name: string;
    /**
     * Check if this implementation could resolve the given value.
     */
    canResolve(value: any): boolean;
    /**
     * The resolve function
     */
    resolve(value: any): any;
}
export default class Zettings {
    private pwd;
    /** List of configured Sources **/
    private sources;
    /** List of value resolvers to be applied each time the get is called */
    private valueResolvers;
    /** The high the number, the lower the priority **/
    private lowestPriority;
    /** Stores the names already used **/
    private nameKeys;
    /** Stores the number of registered sources */
    private counter;
    /**
     * @see Options
     */
    constructor(options: Options);
    /**
     * Add a ValueResolver to be applied each time the #get function is called.
     *
     * @param {ValueResolver} resolver - The resolver instance.
     **/
    addValueResolver(resolver: ValueResolver): void;
    /**
     * Adds a new source to the current Zettings instance.
     *
     * @param {Source} source - The new source instance.
     * default priority       - last
     */
    addSource(source: Source): void;
    /**
     * Adds a new source to the current Zettings instance.
     *
     * @param {Source} source     - The new source instance.
     * @param {number} priority   - The source priority.
     */
    addSource(source: Source, priority: number): void;
    /**
     * Retrieve the number of registered sources.
     */
    count(): number;
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
    getm(key: string, def?: Object): any;
    private resolveValue(value);
    /**
     * Associate the value with the given key.
     *
     * @param {string} key - The mapping key
     * @param {any} value  - The value to be saved
     * @throws {Error}     - An error will be thrown if there is no source that handles this operation
     */
    set(key: string, value: any): void;
}
export declare function getFirstValid(...values: any[]): any;
