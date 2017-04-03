import { Source } from '../zettings';
export default class JsonSource implements Source {
    readonly name: string;
    private readonly json;
    constructor(options: JsonOptions);
    get(keys: string[]): any;
}
export interface JsonOptions {
    name?: string;
    /** Specifies a list of json locations to be merged. **/
    paths: string[];
    /** Specifies the working directory from which the paths will be relative to **/
    pwd?: string | '$HOME';
}
