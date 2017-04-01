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
    defaultTrFunction?: boolean;
    defaultTrObject?: boolean;
    pwd: string;
}
export interface ValueTransformation {
    readonly name: string;
    readonly pattern: RegExp;
    transform(value: any): any;
}
export default class Zettings {
    readonly DEF_PROFILE: string;
    private pwd;
    private sources;
    private transformations;
    private profile;
    private lowestPriority;
    private nameKeys;
    private counter;
    constructor(options: Options);
    addTransformation(transformation: ValueTransformation): void;
    addSource(source: Source): void;
    addSource(source: Source, profile: string): void;
    addSource(source: Source, priority: number): void;
    addSource(source: Source, priority: number, profile: string): void;
    count(profile?: string): number;
    changeProfile(profile: string): void;
    get(key: string, def?: any): any;
    getf(key: string, def?: any): any;
    set(key: string, value: any): void;
}
export declare function getFirstValid(...values: any[]): any;
