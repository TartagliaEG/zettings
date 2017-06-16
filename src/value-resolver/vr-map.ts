import { ValueResolver } from '../types';

const NAME = 'VR-MAP';

/**
 * This value resolver works as a simple map, so it will replace the key name by a pre configured value.
 * E.g:  "key=pwd" => "path/configured/on/zettings"
 * The "key=" is the pattern that this ValueResolver looks for, the remaining text is used as the map key.
 */
export default class VrMap implements ValueResolver {
  readonly name: string = NAME;
  readonly pattern: RegExp = /^key=/;
  readonly map: Map<string, any>;

  constructor(options: MapOptions) {
    this.map = options.map;
  }

  public put(key: string, value: any) {
    this.map.set(key, value);
  }

  public resolve(value: any): any {
    // value#split results in ['key=', '<keyName>']
    const keyName: string = value.trim().split(this.pattern)[1];
    return this.map.get(keyName);
  }

  public canResolve(value: any): boolean {
    if (!this.pattern.test(value))
      return false;

    // value#split results in ['key=', '<keyName>']
    const keyName: string = value.trim().split(this.pattern)[1];
    return this.map.has(keyName);
  }
}

export interface MapOptions {
  map: Map<string, any>
}
