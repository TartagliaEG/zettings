import { Source } from '../zettings';
import * as _ from 'lodash';
import * as Path from 'path';
import * as OS from 'os';

export default class JsonSource implements Source {
  public readonly name: string;
  private readonly json: Object = {};

  constructor(options: JsonOptions) {
    this.name = options.name || 'JSON';
    options.pwd = options.pwd === undefined ? '' : options.pwd;
    options.pwd = options.pwd === '$HOME' ? OS.homedir() : options.pwd;

    options.paths.forEach((path) => {
      try {
        _.merge(this.json, require(Path.join(options.pwd, path)));
      } catch (err) {
        console.error("No valid json found at '" + path + "'", err);
        throw err;
      }
    })
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
