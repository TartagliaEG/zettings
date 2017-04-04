import {primitive} from '../utils/types';
import {ValueResolver} from '../zettings';
import ReferenceResolver from './vr-reference';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';
import {forEachLeaf} from '../utils/node-iteration';

const NAME = 'VR-DEEP-REFERENCE';

const Log = new Logger('vr-deep-reference');

/** 
 * Resolve the references in nested objects 
 */
export default class VrDeepRef implements ValueResolver {
  readonly name: string = NAME;  
  readonly pwd: string;
  readonly vrReference: ReferenceResolver;

  constructor(options: Options) {
    this.pwd = options.pwd;
    this.vrReference = new ReferenceResolver({pwd: options.pwd});
  }

  public resolve(value: any): any {
    forEachLeaf(value, (leaf: primitive, mutate: Function): boolean => {
      if(this.vrReference.canResolve(leaf))
        mutate(this.vrReference.resolve(leaf));
      return false;
    });
    return value;
  }

  public canResolve(value: any): boolean {
    let canResolve = false;

    forEachLeaf(value, (leaf: primitive): boolean => {
      return this.vrReference.canResolve(leaf);
    });    

    return canResolve;
  }
}



export interface Options {
  pwd: string;
}
