import {Source} from '../zettings';

export default class EnvSource implements Source {
  public readonly name: string;
  private readonly letterCase: LetterCase;
  private readonly separator: string;  
  private readonly prefix: string;

  constructor(options?: EnvOptions) {
    options = options || {};
    this.name = options.name || 'ENV';
    this.letterCase = options.letterCase || 'upper';
    this.separator = options.separator || '_';    
    this.prefix = options.prefix;
  }

  public get(keys: string[]): any {
    if(this.prefix)
      keys = [this.prefix].concat(keys);
      
    let key = keys.join(this.separator);
    
    if(this.letterCase == 'upper')
      key = key.toUpperCase();

    if(this.letterCase == 'lower')
      key = key.toLowerCase();

    return process.env[key];
  }  
}


export interface EnvOptions {  
  name?: string;
  /** Specifies the letter case applied to all keys. Defaults to 'upper' **/
  letterCase?: LetterCase;
  /** Specifies the key separator. Defaults to '_' **/
  separator?: string;  
  /** Specifies a prefix to be used in all keys. Defaults to '' **/
  prefix?: string;
}

export type LetterCase = 'upper' | 'lower' | 'normal';