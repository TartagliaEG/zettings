import {ValueTransformation} from '../zettings';
import * as Path from 'path';
import * as _ from 'lodash';
import Logger from '../utils/simple-logger';

const NAME = 'TR-FUNCTION';

const Log = new Logger('tr-function');

/** 
 * Call the function specified by the "path" within the pattern ${fn=path}. 
 * E.g:  ${fn=/path/to/the/module#functionName}
 */
export default class TrFunction implements ValueTransformation {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^(\${fn=)([^}]+)(})$/i;
  readonly pwd: string;

  constructor(options: Options) {
    this.pwd = options.pwd;
  }

  transform(value: any): any {
    // value#split results in ['', '${fn=', '<content>', '}']
    const content: string = value.split(this.pattern)[2]; 

    if(content.indexOf('#') < 0)
      throw new Error('Invalid function name. Expected "[path_to_module]#[function_name]" but found "' + content + '"');

    const dir = content.split('#')[0];
    const funct = content.split('#')[1];    
    const mod = require(Path.join(this.pwd, dir));

    Log.d('Loading function "' + content + "'");

    return (<Function> _.get(mod, funct))(value);    
  }
}

export interface Options {
  pwd: string;
}