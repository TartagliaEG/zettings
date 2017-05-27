// import VrDeepRef from './value-resolver/vr-deep-reference';
import VrMap from './value-resolver/vr-map';
import EnvSource from './sources/src-env';
import MemorySource from './sources/src-memory';
import Logger from './utils/simple-logger';
import VrReference from './value-resolver/vr-reference';
import { isValid, isObject, isArray, isPrimitive } from './utils/type-check';
import { forEachLeaf } from './utils/node-iteration';
import * as _ from 'lodash';

const Log = new Logger('Zettings');

export interface Source {
  readonly name: string;
  get(key: string[]): any;
  set?(ket: string[], value: any): void;
}


/**
 * Zettings Options
 */
export interface Options {

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
   * Specifies if the default reference resolver should be used
   * default - true
   */
  defaultVrReference?: boolean;

  /**
   * Specifies if the default deep reference resolver should be used.
   * default - true
   */
  defaultVrDeepRef?: boolean;


  /**
   * Specifies if the default map resolve should be used. The default map contains only the pwd key.
   * default - true
   */
  defaultVrMap?: boolean;

  /**
   * Specify the working directory
   */
  pwd: string

}


interface PrioritySource {
  readonly priority: number;
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
  private pwd: string;

  /** List of configured Sources **/
  private sources: PrioritySource[] = [];

  /** List of value resolvers to be applied each time the get is called */
  private valueResolvers: ValueResolver[] = [];

  /** The high the number, the lower the priority **/
  private lowestPriority: number;

  /** Stores the names already used **/
  private nameKeys: Object = {};

  /** Stores the number of registered sources */
  private counter: number = 0;

  /**
   * @see Options
   */
  constructor(options: Options) {
    this.lowestPriority = 0;
    this.pwd = options.pwd;

    options.defaultMemoSource = getFirstValid(options.defaultMemoSource, true);
    options.defaultEnvSource = getFirstValid(options.defaultEnvSource, true);
    options.defaultVrReference = getFirstValid(options.defaultVrReference, true);
    options.defaultVrDeepRef = getFirstValid(options.defaultVrDeepRef, true);
    options.defaultVrMap = getFirstValid(options.defaultVrMap, true);

    let memoPriority = getFirstValid(options.defaultMemoSourcePriority, 1);
    let envPriority = getFirstValid(options.defaultEnvSourcePriority, 5);

    if (options.defaultMemoSource)
      this.addSource(new MemorySource({}), memoPriority);

    if (options.defaultEnvSource)
      this.addSource(new EnvSource(), envPriority);

    if (options.defaultVrReference)
      this.addValueResolver(new VrReference({ pwd: this.pwd }));

    if (options.defaultVrMap) {
      const map = new Map<string, any>();
      map.set('pwd', this.pwd);
      this.addValueResolver(new VrMap({ map: map }));
    }
  }


  /**
   * Add a ValueResolver to be applied each time the #get function is called.
   *
   * @param {ValueResolver} resolver - The resolver instance.
   **/
  public addValueResolver(resolver: ValueResolver): void {
    Log.i("New value resolver ->  { name: '" + resolver.name + "' }");
    this.valueResolvers.push(resolver);
  }


  /**
   * Adds a new source to the current Zettings instance.
   *
   * @param {Source} source - The new source instance.
   * default priority       - last
   */
  public addSource(source: Source): void;


  /**
   * Adds a new source to the current Zettings instance.
   *
   * @param {Source} source     - The new source instance.
   * @param {number} priority   - The source priority.
   */
  public addSource(source: Source, priority: number): void;


  /**
   * @see addSource(source: Source): void;
   * @see addSource(source: Source, priority: number): void;
   */
  public addSource(source: Source, priority?: number): void {

    if (priority === undefined) {
      priority = this.lowestPriority + 1;

    } else if (typeof priority !== 'number') {
      throw Error('Invalid parameters. Expected priority to be a number, but found: ' + typeof priority + '.');

    }

    this.lowestPriority = priority > this.lowestPriority ? priority : this.lowestPriority;
    this.counter++;

    if (this.nameKeys[source.name])
      throw new Error("The name '" + source.name + "' is being used already.");

    this.nameKeys[source.name] = true;

    Log.i("New source added ->  { name: '" + source.name + "', priority: '" + priority + "' }");

    this.sources.push({ priority: priority, source: source });
    this.sources = this.sources.sort((sourceA, sourceB) => {
      return sourceA.priority - sourceB.priority;
    });
  }

  /**
   * Retrieve the number of registered sources.
   */
  public count(): number {
    return this.counter;
  }

  /**
   * [get-merged]:
   *
   * Retrieve the value associated with the given key. If the first source returns a primitive or an array, it will be returned.
   * Otherwise, if the first source returns an object, the other source will be queried and have its results merged. The properties
   * from the first source found have higher priority. If the other sources return primitives or arrays, they will be ignored.
   *
   * @param {string} key - The key whose associated value is to be returned.
   * @param {any} [def]  - A default value used when no value was found.
   */
  public getm(key: string, def?: Object): any {
    const keys = key.replace(/]/g, '').split(/[\[.]/g);
    let result: any;
    let type: string;

    for (let i = 0; i < this.sources.length; i++) {
      const prioritySource = this.sources[i];
      const source = prioritySource.source;

      let value = source.get(keys);

      if (!isValid(value))
        continue;

      // If the 'type' has not been set yet and the value isn't an object, we can break the loop (primitives and arrays won't be merged).
      if (!isValid(type) && !isObject(value)) {
        result = this.resolveValue(value);
        break;
      }

      value = this.resolveValue(value);

      type = type || typeof value;
      result = result || {};

      if (typeof value !== type)
        continue;

      result = _.merge({}, value, result);
    }

    return result === undefined ? def : result;
  }


  private resolveValue(value: any): any {

    forEachLeaf(value, (leaf, mutate) => {
      for (let i = 0; i < this.valueResolvers.length; i++) {
        const resolver = this.valueResolvers[i];

        if (!resolver.canResolve(leaf))
          continue;

        const resolvedValue = resolver.resolve(leaf);

        if (isPrimitive(value))
          value = resolvedValue;
        else
          mutate(resolvedValue);
      }
      return false;
    });

    return value;
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

    for (let i = 0; i < this.sources.length; i++) {
      const prioritySource = this.sources[i];
      const source = prioritySource.source;

      if (typeof source.set == "function") {
        isSetSupported = true;
        source.set(keys, value);
      }
    }

    if (!isSetSupported)
      throw new Error("There is no source configured that implements the 'set' method");
  }
}


export function getFirstValid(...values: any[]): any {
  for (let i = 0; i < values.length; i++) {
    if (values[i] != undefined && values[i] != null)
      return values[i];
  }
}
