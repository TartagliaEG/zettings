import { Source } from '../zettings';
import * as _ from 'lodash';

export default class MemorySource implements Source {
  public readonly name: string;
  private readonly json: Object = {};

  constructor(options?: MemoryOptions) {
    options = options || {};
    this.name = options.name || 'MEMORY';
  }


  public get(keys: string[]): any {
    return _.get(this.json, keys);
  }

  public set(keys: string[], value: any): void {
    _.set(this.json, keys, value);
  }
}


export interface MemoryOptions {
  name?: string
}