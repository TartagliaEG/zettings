import { Source } from '../types';
import * as _ from 'lodash';
import * as Path from 'path';
import * as OS from 'os';

export default class JsonSource implements Source {
  public readonly name: string;
  private json: Object = {};
  private readonly paths: string[];

  constructor(options: JsonOptions) {
    this.name = options.name || 'JSON';
    options.pwd = options.pwd === undefined ? '' : options.pwd;
    options.pwd = options.pwd === '$HOME' ? OS.homedir() : options.pwd;

    this.paths = options.paths.map(path => Path.join(options.pwd, path));
    this.refresh();
  }

  public refresh(): void {
    this.json = {};
    this.paths.forEach((path) => {
      try {
        _.merge(this.json, require(path));
      } catch (err) {
        console.error("No valid json found at '" + path + "'", err);
        throw err;
      }
    });
  }

  public get(keys: string[]): any {
    return _.get(this.json, keys);
  }
}


export interface JsonOptions {
  /** The source name **/
  name?: string,
  /** Specifies a list of json locations to be merged. **/
  paths: string[],
  /** Specifies the working directory from which the paths will be relative to **/
  pwd?: string | '$HOME'
}
