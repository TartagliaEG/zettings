import {primitive} from '../utils/types';
import {ValueResolver} from '../zettings';
import ReferenceResolver from './vr-reference';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';
import {forEachLeaf} from '../utils/node-iteration';

const NAME = 'TR-FUNCTION';

const Log = new Logger('tr-function');

/** 
 * Load the module (or any sub property) specified by the "path" within the pattern ${ref=path}. 
 * E.g:  ${ref=/path/to/the/module}  OR  ${ref=/path/to/the/module#subProperty}
 */
export default class VrZettings implements ValueResolver {
  readonly name: string = NAME;  
  readonly pwd: string;
  readonly vrreference: ReferenceResolver;

  constructor(options: Options) {
    this.pwd = options.pwd;
    this.vrreference = new ReferenceResolver({pwd: options.pwd});
  }

  public resolve(value: any): any {
    forEachLeaf(value, (leaf: primitive, mutate: Function): boolean => {
      if(this.vrreference.canResolve(leaf))
        mutate(this.vrreference.resolve(leaf));
      return false;
    });    
  }

  public canResolve(value: any): boolean {
    let canResolve = false;

    forEachLeaf(value, (leaf: primitive): boolean => {
      return this.vrreference.canResolve(leaf);
    });    

    return canResolve;
  }
}



export interface Options {
  pwd: string;
}
