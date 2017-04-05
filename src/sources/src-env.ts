import {Source} from '../zettings';
import Logger from '../utils/simple-logger';
import {safeReplace, toUppercase, replaceAll} from '../utils/text-replacements';
import {toLeaf} from '../utils/node-iteration';

const Log = new Logger('src-env');

const SEPARATOR_TEMP = "§§";
const UPPERCASE_TEMP = "¬¬";

export interface Dependencies {
  toUppercase: (keys: string[], token: string) => string[];
  safeReplace: (text: string, replacements: {key: string, replaceBy: string}[]) => string;
  deepAssign: (props: string[], value: any, root?: Object|Array<any>) => Object|Array<any>;
}

export default class EnvSource implements Source {
  public readonly name: string;
  private readonly environmentCase: LetterCase;
  private readonly separatorToken: string;
  private readonly uppercaseToken: string;
  private readonly prefix: string;
  private readonly deps: Dependencies;

  constructor(options?: EnvOptions) {
    options = options || {};
    this.name = options.name || 'ENV';
    this.environmentCase = options.environmentCase || 'upper';
    this.separatorToken = options.separatorToken || '__';
    this.uppercaseToken = options.uppercaseToken ||  (options.environmentCase !== 'no_change' ? '_' : undefined);
    this.prefix = options.prefix;

    if(this.environmentCase === "no_change" && this.uppercaseToken)
      throw new Error("Conflicting configuration. You can't set an uppercaseToken altogether with 'no_change' environmentCase. Configuring the uppercaseToken means that any occurrence of the given token should be used to modify the provided keys, and configuring the environmentCase as 'no_change' means that the keys should be used without changes.");

    if(this.separatorToken === this.uppercaseToken)
      throw new Error("You can't configure two different tokens with the same value - {"  +
        "separatorToken: " + this.separatorToken + ", " +
        "uppercaseToken: " + this.uppercaseToken + "}");

    this.deps = options.dependencies || {
      safeReplace: safeReplace,
      toUppercase: toUppercase,
      deepAssign: toLeaf
    };
  }

  public get(keys: string[]): any {
    keys = [].concat(keys); // clone
    if(this.prefix)
      keys = [this.prefix].concat(keys);

    this.insertUppercaseToken(keys);
    this.applyEnvironmentCase(keys);

    const key = keys.join(this.separatorToken);

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
    const allEnvKeys = Object.keys(process.env);

    for(let i = 0; i < allEnvKeys.length; i++) {
      const envKey = allEnvKeys[i];
      const start = key + this.separatorToken;

      if(!envKey.startsWith(start))
        continue;

      let remaining = envKey.replace(start, '');

      if(this.environmentCase !== 'no_change')
        remaining = remaining.toLowerCase();

      const replacements = [{key: this.separatorToken, replaceBy: SEPARATOR_TEMP}];

      if(this.uppercaseToken)
        replacements.push({key: this.uppercaseToken, replaceBy: UPPERCASE_TEMP});

      remaining = this.deps.safeReplace(remaining, replacements);

      let objKeys = remaining.split(SEPARATOR_TEMP);
      objKeys = this.uppercaseToken ? this.deps.toUppercase(objKeys, UPPERCASE_TEMP) : objKeys;

      result = this.deps.deepAssign(objKeys, process.env[envKey], result);
    };

    return result;
  }

  /**
   * Prefix all uppercase letters with the configured uppercaseToken.
   * @param {string[]} keys
   */
  private insertUppercaseToken(keys: string[]): void {
    if(!this.uppercaseToken)
      return;

    const ucase = /[A-Z]/;

    for(let i = 0; i < keys.length; i++) {
      let newKey: string = '';
      keys[i].split('').forEach((char) => {
        newKey += ucase.test(char) ? this.uppercaseToken + char : char;;
      });
      keys[i] = newKey;
    }
  }

  /**
   * Change the key letter case to the environment variables letter case
   * @param {string[]} keys
   */
  private applyEnvironmentCase(keys: string[]): void {
    for(let i = 0; i < keys.length; i++) {
      if(this.environmentCase === 'upper')
        keys[i] = keys[i].toUpperCase();

      else if(this.environmentCase === 'lower')
        keys[i] = keys[i].toLowerCase();
    }
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
   * variable named 'SERVER__SETTINGS__MAIN_PORT', calling #get(['server']) will returns { settings: {mainPort: <value>} }.
   */
  uppercaseToken?: string,

  /** Specifies the key separator. Defaults to '__' **/
  separatorToken?: string,

  /** Specifies a prefix to be used in all keys. Defaults to '' **/
  prefix?: string;

  /** Optional function dependencies */
  dependencies?: Dependencies;
}

export type LetterCase = 'upper' | 'lower' | 'no_change';

