import { ValueResolver } from '../types';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';

const NAME = 'VR-MAP';

const Log = new Logger('vr-map');

/**
 * This value resolver works as a simple map, so it will replace the key name by a pre configured value.
 * E.g:  "key=pwd" => "path/configured/on/zettings"
 */
export default class VrMap implements ValueResolver {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^key=/;
  readonly map: Map<string, any>;

  constructor(options: MapOptions) {
    this.map = options.map;
  }

  public put(key: string, value: any) {
    this.map.set(key, value);
  }

  public resolve(value: any): any {
    // value#split results in ['', 'key=', '<keyName>']
    const keyName: string = value.trim().split(this.pattern)[1];
    return this.map.get(keyName);
  }

  public canResolve(value: any): boolean {
    // value#split results in ['', 'key=', '<keyName>']
    if (!this.pattern.test(value))
      return false;

    const keyName: string = value.trim().split(this.pattern)[1];
    return this.map.has(keyName);
  }
}

export interface MapOptions {
  map: Map<string, any>
}
