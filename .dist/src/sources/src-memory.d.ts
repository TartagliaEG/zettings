import { Source } from '../zettings';
export default class MemorySource implements Source {
    readonly name: string;
    private readonly json;
    constructor(options?: MemoryOptions);
    get(keys: string[]): any;
    set(keys: string[], value: any): void;
}
export interface MemoryOptions {
    name?: string;
}
