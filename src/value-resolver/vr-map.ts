import { ValueResolver } from '../zettings';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';

const NAME = 'VR-MAP';

const Log = new Logger('vr-map');

/**
 * This value resolver works as a simple map, so it will replace the value within the pattern ${key=value} by a pre configured value.
 * E.g:  "${key=pwd}" => "path/configured/on/zettings"
 */
export default class VrMap implements ValueResolver {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^(\${key=)([^}]+)(})$/;
  readonly map: Map<string, any>;

  constructor(options: Options) {
    this.map = options.map;
  }

  public resolve(value: any): any {
    // value#split results in ['', '${key=', '<content>', '}']
    const content: string = value.split(this.pattern)[2];
    return this.map.get(content);
  }

  public canResolve(value: any): boolean {
    // value#split results in ['', '${key=', '<content>', '}']
    if (!this.pattern.test(value))
      return false;

    const content: string = value.split(this.pattern)[2];
    return this.map.has(content);
  }
}

export interface Options {
  map: Map<string, any>
}
