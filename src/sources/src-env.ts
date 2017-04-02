import {Source} from '../zettings';
import Logger from '../utils/simple-logger';
import {isNumeric} from '../utils/type-check';

const Log = new Logger('src-env');

export default class EnvSource implements Source {
  public readonly name: string;
  private readonly environmentCase: LetterCase;
  private readonly separatorToken: string;    
  private readonly uppercaseToken: string;
  private readonly prefix: string;
  private readonly SEPARATOR_TEMP = "§§";
  private readonly SEPARATOR_REGX = /§§/g;
  private readonly UPPERCASE_TEMP = "¬¬";
  private readonly UPPERCASE_REGX = /(?=¬¬)/g;

  constructor(options?: EnvOptions) {
    options = options || {};
    this.name = options.name || 'ENV';
    this.environmentCase = options.environmentCase || 'upper';
    this.separatorToken = options.separatorToken || '__';
    this.uppercaseToken = options.uppercaseToken;
    this.prefix = options.prefix;
  }

  public get(keys: string[]): any {
    if(this.prefix)
      keys = [this.prefix].concat(keys);
      
    let key = keys.join(this.separatorToken);

    key = this.applyUppercaseToken(key);    
    key = this.applyEnvironmentCase(key);
        
    if(process.env[key] !== undefined)
      return process.env[key];
    
    return this.getAsObject(key);    
  }

  /**
   * Transform all environment variables that starts with the given key in an object.
   * 
   * @param {string} key
   */
  private getAsObject(key: string): Object {
    let result: Object;

    Object.keys(process.env).forEach((envKey) => {
      const start = key + this.separatorToken;

      if(!envKey.startsWith(start))
        return;
      
      result = result || {};      
      let remaining = envKey.replace(start, '');  

      // Replace the tokens to prevent collision
      if(this.uppercaseToken) {

        // Check whether one of the tokens contains the other
        if(this.separatorToken.indexOf(this.uppercaseToken) !== -1) {
          remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
          remaining = remaining.replace(this.uppercaseToken, this.UPPERCASE_TEMP);
        }

        else if(this.uppercaseToken.indexOf(this.separatorToken) !== -1) {
          remaining = remaining.replace(this.uppercaseToken, this.UPPERCASE_TEMP);
          remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
        }

      } else {
        remaining = remaining.replace(this.separatorToken, this.SEPARATOR_TEMP);
      }
      

      // Change the key case.
      if(this.environmentCase !== 'no_change') {
        let ucase = '';
        
        remaining.split(this.UPPERCASE_REGX).forEach((key) => {
          if(!key.startsWith(this.UPPERCASE_TEMP))
            return ucase += key;
          
          const tempKey = key.replace(this.UPPERCASE_TEMP, '');

          if(tempKey.length === 0) {
            Log.w("The uppercase token is being used as the last character: " + envKey);
            return;
          }
          
          ucase += tempKey.charAt(0).toUpperCase() + tempKey.slice(1);        
        });      

        remaining = ucase;
      }
      

      // Transform the environment key in an object
      let currNode = result;
      remaining.split(this.SEPARATOR_REGX).forEach((key, idx, arr) => {
        if(key.length === 0)
          return;

        currNode[key] = currNode[key] || isNumeric(key) ? [] : {};        

        if(idx === arr.length - 1) 
          currNode[key] = process.env[envKey];
        
        currNode = currNode[key];
      });

    });

    return result;
  }

  /**
   * Prefix all uppercase letters with the configured uppercaseToken.
   * 
   * @param {string} key 
   */
  private applyUppercaseToken(key: string) {
    if(!this.uppercaseToken) 
      return key;

    const ucase = /[A-Z]/;
    let newKey: string = '';

    key.split('').forEach((char) => {        
      newKey += ucase.test(char) ? this.uppercaseToken + char : char;;
    });

    return newKey;
  }

  /**
   * Change the key letter case to match with the environment variables
   * 
   * @param {string} key
   */
  private applyEnvironmentCase(key: string): string {
    if(this.environmentCase === 'upper')
      key = key.toUpperCase();

    else if(this.environmentCase === 'lower')
      key = key.toLowerCase();

    return key;
  }
  
}







export interface EnvOptions {  
  name?: string;
  
  /** 
   * Specifies in which letter case the environment variables are declared (so the #get method could change the keys letter case).
   **/
  environmentCase?: LetterCase,

  /**
   * Specifies a token to be used as a marker to uppercase letters.
   * 
   * If all environment variables are being declared with the same letter case, this token could be used to mark capital letters.
   * For example, if the property 'uppercaseToken' was set to '_', the 'separatorToken' was set to  '__' and there is an environment 
   * variable named 'SERVER__SETTINGS__MAIN_PORT', calling #get(['server']) will return the object { settings: {mainPort: <value>} }.
   */
  uppercaseToken?: string,

  /** Specifies the key separator. Defaults to '__' **/
  separatorToken?: string,  
  
  /** Specifies a prefix to be used in all keys. Defaults to '' **/
  prefix?: string;
}

export type LetterCase = 'upper' | 'lower' | 'no_change';

