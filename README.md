# Zettings

It's a simple configuration resolver with customizable sources and value resolvers.

---

### Usage

Simple usage with an additional json source:
```javascript
import Zettings, {JsonSource} from 'zettings';

let zet = new Zettings({pwd: __dirname});
zet.addSource(new JsonSource({pwd: pwd, paths: [ 'path/to/json1.json', 'other/json.json' ]}), 6 /** priority **/);
zet.getm('the.property.path');

```

The same code but configuring all defaults manually:
```javascript
// Creating the zettings
import Zettings, {MemorySource, EnvSource, VrReference, VrMap, JsonSource} from 'zettings';

const pwd = __dirname;

let zet = new Zettings({
  pwd: pwd,
  // I'm disabling the default sources and value resolvers so I could add it manually later.
  defaultEnvSource: false,
  defaultMemoSource: false,
  defaultVrReference: false,
  defaultVrMap: false
});

/** The following configuration is done just for example purpose, if you don't disable the defaults they will be added automatically. **/

// Sources
zet.addSource(new MemorySource(), 1 /** priority **/);
zet.addSource(new EnvSource(), 5 /** priority **/);

// Value resolvers
zet.addValueResolver(new VrReference({ pwd: this.pwd }));

const map = new Map<string, any>();
map.set('pwd', this.pwd);

zet.addValueResolver(new VrMap({ map: map }));

// The next source is a custom one. Since you need to point the json path, it isn't added by default.
zet.addSource(new JsonSource({pwd: pwd, paths: [ 'path/to/json1.json', 'other/json.json' ]}), 6 /** priority **/);
zet.getm('the.property.path');

```


### Structure
There are three different components composing the library: the Zettings, the Source and the ValueResolver. As their name implies, the Source represents a configuration source (a json file, the environment variables, etc.) and the ValueResolver resolves value passed to it (e.g. "pwd" resolves to "/the/configured/pwd"). Zettings is the main class that uses the configured sources and value resolvers to retrieve the exprected value, so it is responsible for passing the keys to the proper source and the value to the proper resolver.


All sources must implements the [Source](./src/types.ts#L1) interface:

| Type     | Name                  | Description
| -        | -                     | -
| +P | name: string | A unique identifier associated with each source
| +M | get( keys: string[] ): any  | Retrieve the configuration value using the given split key
| +M | set?( keys: string[], value: any ) | Associates a new configuration value with the given split keys
| +M | refresh?(): void            | Refresh the source

The library comes with the following source implementations:
* [EnvSource](./src/sources/src-env.ts);
* [JsonSource](./src/sources/src-json.ts);
* [MemorySource](./src/sources/src-memory.ts).

<br /><br />

Like the sources, value resolvers must implements the [ValueResolver](./src/types.ts#L8) interface:

| Type     | Name                       | Description
| -        | -                          | -
| +P | name: string | A unique identifier associated with each value resolver.
| +M | canResolve( value: any ): boolean | Check if the current value resolve can handle the given value.
| +M | resolve( value: any ): any        | Transform and returns the resolved value.

The library comes with the following value resolver implementations:
* [VrMap](./src/value-resolver/vr-map.ts);
* [VrReference](./src/value-resolver/vr-reference.ts).

<br /><br />


The Zettings class exposes the following interface:
| Type     | Name                       | Description
| -        | -                          | -
| +M | addValueResolver( resolver: ValueResolver ) | Adds a new Value resolver
| +M | addSource( source: Source, priority?: number ) | Adds a new Source with the given priority (if not specified, it will be set with the lowest priority)
| +M | getm( key: string, def?: any ) | Retrieve and merge (from all sources) the value associated with the given key or returns the def parameter (case no value was found). It's worth noting that only objects are merged, so if the first source returns a primitive or an array it will be returned immediately.
| +M | refresh(): void | Calls refresh on all sources (that implements it).
| +M | toggleSource( name: string ): void | Enable/Disable the source by its name.
| +M | set( key: string, value: any ): void | Calls set on all sources (that implements it) passing the split key and the given value.

