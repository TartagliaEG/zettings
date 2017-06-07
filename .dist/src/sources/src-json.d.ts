import { Source } from '../types';
export default class JsonSource implements Source {
    readonly name: string;
    private json;
    private readonly paths;
    constructor(options: JsonOptions);
    refresh(): void;
    get(keys: string[]): any;
}
export interface JsonOptions {
    /** The source name **/
    name?: string;
    /** Specifies a list of json locations to be merged. **/
    paths: string[];
    /** Specifies the working directory from which the paths will be relative to **/
    pwd?: string | '$HOME';
}
