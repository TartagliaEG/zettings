export interface Source {
    readonly name: string;
    get(key: string[]): any;
    set?(ket: string[], value: any): void;
}
export interface Options {
    profile?: string;
    defaultEnvSource?: boolean;
    defaultEnvSourcePriority?: number;
    defaultMemoSource?: boolean;
    defaultMemoSourcePriority?: number;
    defaultRsReference?: boolean;
    pwd: string;
}
export interface ValueResolver {
    readonly name: string;
    canResolve(value: any): boolean;
    resolve(value: any): any;
}
export default class Zettings {
    readonly DEF_PROFILE: string;
    private pwd;
    private sources;
    private valueResolvers;
    private profile;
    private lowestPriority;
    private nameKeys;
    private counter;
    constructor(options: Options);
    addValueResolver(resolver: ValueResolver): void;
    addSource(source: Source): void;
    addSource(source: Source, profile: string): void;
    addSource(source: Source, priority: number): void;
    addSource(source: Source, priority: number, profile: string): void;
    count(profile?: string): number;
    changeProfile(profile: string): void;
    getf(key: string, def?: any): any;
    getm(key: string, def?: Object): any;
    private resolveValue(value, def);
    set(key: string, value: any): void;
}
export declare function getFirstValid(...values: any[]): any;
