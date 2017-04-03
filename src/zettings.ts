import EnvSource from './sources/src-env';
import MemorySource from './sources/src-memory';
import Logger from './utils/simple-logger';
import VrReference from './value-resolver/vr-reference';
import {isValid, isObject, isArray, isPrimitive} from './utils/type-check';
import * as _ from 'lodash';

const Log = new Logger('Zettings');

export interface Source {
  readonly name: string;
  /**
   * Specifies which profile the Source is associated with. The Source will not be used if the current Zettings' profile differs from the Source's profile.
   */
  get(key: string[]): any;
  set?(ket: string[], value: any): void;
}


/**
 * Zettings Options
 */
export interface Options {
  /**
   * Define the default profile name. The default sources will be associated with this profile too.
   * default - 'DEFAULT_PROFILE'
   */
  profile?: string,

  /**
   * Specifies if a default EnvSource should be created. 
   * default - true
   */
  defaultEnvSource?: boolean;

  /**
   * Specifies the default EnvSource priority.
   * default - 5
   */
  defaultEnvSourcePriority?: number;

  /**
   * Specifies if a default MemoSource should be created.
   * default - true
   */
  defaultMemoSource?: boolean;

  /**
   * Specifies the default MemoSource priority.
   * default - 1
   */
  defaultMemoSourcePriority?: number;

  /**
   * Specifies if the default module/object resolver should be used
   * default - true
   */
  defaultRsReference?: boolean;

  /**
   * Specify the working directory
   */
  pwd: string
  
}


interface PrioritySource {
  readonly priority: number;
  readonly profile: string;
  readonly source: Source;  
}


export interface ValueResolver {
  /**
   * Name used mainly to log info
   */
  readonly name: string;

  /**
   * Check if this implementation could resolve the given value.
   */
  canResolve(value: any): boolean;

  /**
   * The resolve function
   */
  resolve(value: any): any
}


export default class Zettings {
  readonly DEF_PROFILE: string = 'DEFAULT_PROFILE';
  private pwd: string;

  /** List of configured Sources **/
  private sources: PrioritySource[] = [];

  /** List of value resolvers to be applied each time the get is called */
  private valueResolvers: ValueResolver[] = [];

  /** Current active profile **/
  private profile: string;

  /** The high the number, the lower the priority **/
  private lowestPriority: number;

  /** Stores the names already used per profiles **/
  private nameKeys: Object = {};

  /** Stores the number of sources per profile */
  private counter: Object = {total: 0};

  /**
   * @see Options
   */
  constructor(options: Options) {    
    this.profile = options.profile || this.DEF_PROFILE;
    this.lowestPriority = 0;
    this.pwd = options.pwd;

    options.defaultMemoSource  = getFirstValid(options.defaultMemoSource, true);    
    options.defaultEnvSource   = getFirstValid(options.defaultEnvSource,  true);
    options.defaultRsReference = getFirstValid(options.defaultRsReference,   true);
    

    let memoPriority = getFirstValid(options.defaultMemoSourcePriority, 1);
    let envPriority  = getFirstValid(options.defaultEnvSourcePriority,  5);

    if (options.defaultMemoSource) 
      this.addSource(new MemorySource({}), memoPriority, this.profile);
    
    if (options.defaultEnvSource)
      this.addSource(new EnvSource(), envPriority, this.profile);

    if (options.defaultRsReference)
      this.addValueResolver(new VrReference({pwd: this.pwd}));      
  }


  /** 
   * Add a ValueResolver to be applied each time the #get function is called.
   * 
   * @param {ValueResolver} resolver - The resolver instance.
   **/
  public addValueResolver(resolver: ValueResolver): void {
    this.valueResolvers.push(resolver);
  }


  /**
   * Adds a new source to the current Zettings instance.
   * 
   * @param {Source} source - The new source instance.
   * default priority       - last
   * default profile        - default configured profile
   */
  public addSource(source: Source): void;


  /**
   * Adds a new source to the current Zettings instance.
   * 
   * @param {Source} source   - The new source instance.   
   * @param {string} profile  - The source profile 
   * default priority         - last
   */ 
  public addSource(source: Source, profile: string): void;


  /**
   * Adds a new source to the current Zettings instance.
   * 
   * @param {Source} source     - The new source instance.
   * @param {number} priority   - The source priority.
   * default profile            - default configured profile
   */
  public addSource(source: Source, priority: number): void;


  /**      
   * Adds a new source to the current Zettings instance.
   * 
   * @param {Source} source     - The new source instance.
   * @param {number} priority   - The source priority.
   * @param {string} profile    - The source profile       
   */
  public addSource(source: Source, priority: number, profile: string): void;

  
  /**
   * @see addSource(source: Source): void;
   * @see addSource(source: Source, profile: string): void;
   * @see addSource(source: Source, priority: number): void;
   * @see addSource(source: Source, priority: number, profile: string): void;
   */
  public addSource(source: Source, priority?: string | number, profile?: string): void {

    if(priority === undefined && profile === undefined) {
      priority = this.lowestPriority + 1;
      profile = this.profile;

    } else if(typeof priority === 'string' && profile === undefined) {
      profile = priority;
      priority = this.lowestPriority + 1;

    } else if (typeof priority === 'number' && profile === undefined) {
      profile = this.profile;

    } else if (typeof priority !== 'number' || typeof profile !== 'string') {
      throw Error('Invalid parameters. Expected (Object, [number, string]) or (Object, [number|string]) but found (' + typeof source + ', ' + typeof priority + ', ' + typeof profile + ')');

    }

    if(profile === 'total') {
      throw new Error("'total' is a reserver keyword and can't be used as a profile.");
    }

    this.lowestPriority = priority > this.lowestPriority ? priority : this.lowestPriority;

    this.counter[profile] = this.counter[profile] || 0;
    this.counter[profile]++;
    this.counter['total']++;

    const composedName = profile + ':' + source.name;

    if (this.nameKeys[composedName]) {
      throw new Error("The name '" + source.name + "' already exists in the '" + profile + "' profile");
    }

    this.nameKeys[composedName] = true;

    Log.d("New source added ->  { name: '" + source.name + "', profile: '" + profile + "' }");    

    this.sources.push({priority: priority, profile, source: source});
    this.sources = this.sources.sort((sourceA, sourceB) => {
      return sourceA.priority - sourceB.priority;
    });    
  } 

  /**
   * Retrieve the number of sources associated with the given profile. 
   * 
   * @param {string} [profile] - The profile. defaults to "total".
   */
  public count(profile?: string): number {
    profile = profile || 'total';
    return this.counter[profile] || 0;
  }

  /**
   * Change the current configured profile. Only Sources added with the given profile will be used.   
   * @param {string} profile The new profile.
   */
  public changeProfile(profile: string): void {
    this.profile = profile;
  }
  
  
  /**
   * Retrieve the value associated with the given key from the first matching source.
   * 
   * @param {string} key - The key whose associated value is to be returned.
   * @param {any} [def]  - A default value used when no value was found.
   */
  public getf(key: string, def?: any): any {
    let keys = key.replace(/]/g, '').split(/[\[.]/g);
    let result: any;

    for(let i = 0; i < this.sources.length; i++) {
      const prioritySource = this.sources[i];
      const source = prioritySource.source;

      if(prioritySource.profile !== this.profile) 
        continue;

      const value = source.get(keys);
      
      if (value === undefined)
        continue;
      
      result = value;
      break;
    }

    return this.resolveValue(result, def);
  }

  /**   
   * Retrieve the value associated with the given key. If the first source returns a primitive or an array, it will be returned. 
   * Otherwise, if the first source returns an object, the other source will be queried and have its results merged. The properties
   * from the first source have higher priority. If the other sources return primitives or arrays, they will be ignored.
   * 
   * @param {string} key - The key whose associated value is to be returned.
   * @param {any} [def]  - A default value used when no value was found.
   */
  public getm(key: string, def?: Object): any {
    const keys = key.replace(/]/g, '').split(/[\[.]/g);
    let result: any;
    let type: string;

    for(let i = 0; i < this.sources.length; i++) {
      const prioritySource = this.sources[i];
      const source = prioritySource.source;

      if(prioritySource.profile !== this.profile) 
        continue;

      const value = source.get(keys);
      
      if (!isValid(value))
        continue;

      // If the 'type' has not been set yet and the value isn't an object, we can break the loop (primitives and arrays won't be merged).
      if(!isValid(type) && !isObject(value)) {
        result = this.resolveValue(value, def);
        break;
      }

      type = type || typeof value;
      result = result || {};

      if(typeof value !== type)
        continue;     
      
      result = _.merge({}, value, result);
    }

    return result;
  }


  private resolveValue(value: any, def: any): any {    

    this.valueResolvers.some((resolver) => {
      if (resolver.canResolve(value)) {
        value = resolver.resolve(value);
        return true;
      }

      return false;
    });

    return value === undefined ? def : value;
  }


  /**
   * Associate the value with the given key.
   * 
   * @param {string} key - The mapping key
   * @param {any} value  - The value to be saved
   * @throws {Error}     - An error will be thrown if there is no source that handles this operation
   */
  public set(key: string, value: any) {
    let keys = key.replace(/]/g, '').split(/[\[.]/g);
    let isSetSupported = false;

    for(let i = 0; i < this.sources.length; i++) {
      const prioritySource = this.sources[i];
      const source = prioritySource.source;      

      if(typeof source.set == "function" && this.profile == prioritySource.profile) {
        isSetSupported = true;
        source.set(keys, value);
      }
    }

    if(!isSetSupported)
      throw new Error("There is no source configured that implements the 'set' method");
  }
}


export function getFirstValid(...values: any[]): any {
  for(let i = 0; i < values.length; i++) {
    if(values[i] != undefined && values[i] != null)
      return values[i];
  }
}


import VrDeepRef from './value-resolver/vr-deep-reference';
const v = new VrDeepRef({pwd: __dirname + '/../test/value-resolver/'});
v.resolve({ root: '${ref=./vr-reference-mock}' });