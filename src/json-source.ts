import {Source} from './zettings';
import * as _ from 'lodash';

export class JsonSource implements Source {
  public readonly name: string;  
  private readonly json: Object = {};

  constructor(options: JsonOptions) {    
    this.name = options.name || 'JSON';

    options.paths.forEach((path) => {
      try {
        _.merge(this.json, require(path));
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
  name?: string,
  profile?: string,
  paths: string[]
}