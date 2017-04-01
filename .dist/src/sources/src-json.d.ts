import { Source } from '../zettings';
export default class JsonSource implements Source {
    readonly name: string;
    private readonly json;
    constructor(options: JsonOptions);
    get(keys: string[]): any;
}
export interface JsonOptions {
    name?: string;
    paths: string[];
    pwd?: string | '$HOME';
}
