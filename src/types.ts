export interface Source {
  readonly name: string;
  get(key: string[]): any;
  set?(key: string[], value: any): void;
  refresh?(): void;
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

import Zettings, { ZetExpressionTokens, ZetOptions } from './zettings';
export default Zettings;
export { ZetExpressionTokens, ZetOptions };

// Sources
import EnvSource, { EnvDependencies, EnvOptions } from './sources/src-env';
import JsonSource, { JsonOptions } from './sources/src-json';
import MemorySource, { MemoryOptions } from './sources/src-memory';

export { EnvSource, EnvDependencies, EnvOptions, JsonOptions, JsonSource, MemoryOptions, MemorySource };

// Value Resolver
import VrMap, { MapOptions } from './value-resolver/vr-map';
import VrReference, { RefOptions } from './value-resolver/vr-reference';

export { VrMap, MapOptions, VrReference, RefOptions };