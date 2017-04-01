import {ValueTransformation} from '../zettings';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';

const NAME = 'TR-FUNCTION';

const Log = new Logger('tr-function');

/** 
 * Load the module (or any sub property) specified by the "path" within the pattern ${obj=path}. 
 * E.g:  ${obj=/path/to/the/module}  OR  ${obj=/path/to/the/module#subProperty}
 */
export default class TrObject implements ValueTransformation {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^(\${obj=)([^}]+)(})$/i;
  readonly pwd: string;

  constructor(options: Options) {
    this.pwd = options.pwd;
  }

  public transform(value: any): any {
    // value#split results in ['', '${obj=', '<content>', '}']
    const content: string = value.split(this.pattern)[2]; 

    let moduleProp: string = content.split('#')[1];
    let modulePath: string = content.split('#')[0];
    
    let module: any; 
    try {
      module = require(Path.join(this.pwd, modulePath));          
    } catch(err) {
      Log.e('Faile to load the module pointed by the path "'+modulePath+'"');
      throw err;
    }
    
    return !!moduleProp ? _.get(module, moduleProp) : module;
  }
}

export interface Options {
  pwd: string;
}
