import { ValueResolver } from '../types';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';

const NAME = 'VR-REFERENCE';

const Log = new Logger('vr-reference');

/**
 * Load the module (or any sub property) specified by the "path" within the pattern ${ref=path}.
 * E.g:  ${ref=/path/to/the/module} OR ${ref=/path/to/the/module#subProperty}
 */
export default class VrReference implements ValueResolver {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^(\${ref=)([^}]+)(})$/i;
  readonly pwd: string;

  constructor(options: RefOptions) {
    this.pwd = options.pwd;
  }

  public resolve(value: any): any {
    // value#split results in ['', '${ref=', '<content>', '}']
    const content: string = value.split(this.pattern)[2];

    let moduleProp: string = content.split('#')[1];
    let modulePath: string = content.split('#')[0];
    let module: any;

    try {
      if (/^[a-zA-Z]/.test(modulePath)) {
        module = require(modulePath);
        return !!moduleProp ? _.get(module, moduleProp) : module;
      }
    } catch (err) { /* ignore this error. */ }

    try {
      module = require(Path.join(this.pwd, modulePath));
      return !!moduleProp ? _.get(module, moduleProp) : module;

    } catch (err) {
      Log.e('Faile to load the file pointed by the path "' + modulePath + '"');
      throw err;
    }

  }

  public canResolve(value: any): boolean {
    return this.pattern.test(value);
  }
}

export interface RefOptions {
  pwd: string;
}
