# Options

Source: [lib/index.js](../../lib/index.js).

## Plugin options

The plugin keeps one block of connection defaults under the key `redis`.

| Option | Type | Default | Effect |
| ------ | ---- | ------- | ------ |
| `redis.type` | string | `'redis'` | Informational; the hook pattern decides the type. |
| `redis.host` | string | `'localhost'` | Redis host used when neither `url` nor a per-call `host` is given. |
| `redis.port` | number | `6379` | Redis port used when neither `url` nor a per-call `port` is given. |
| `redis.timeout` | number | Seneca `timeout` option minus 555 (21667 with the Seneca 4 default of 22222), or 22222 if Seneca has no `timeout` | Copied into the listen and client settings. Neither this plugin nor the seneca-transport utilities read it. |
| `redis.url` | string | none | A Redis URL, `redis://[user][:password@]host[:port][/db]`. When set it is used instead of `host` and `port`. |

## Where options come from

The plugin builds its options with `seneca.util.deepextend` from, in
order (later wins):

1. The defaults above.
2. The Seneca instance option `transport` (for example
   `Seneca({ transport: { redis: { url: '...' } } })`). Seneca 3 and
   Seneca 4 both keep this top level block.
3. The options passed to `use()`, for example
   `.use('@seneca/redis-pubsub-transport', { redis: { port: 16382 } })`.

## Per-call settings

The object passed to `listen()` or `client()` is merged over the `redis`
block (for type `redis`) with `Object.assign`, so per-call values win.

| Setting | Type | Effect |
| ------- | ---- | ------ |
| `type` | string | `'redis'` (or legacy `'pubsub'`, see [Messages](messages.md#legacy-type-pubsub)). Required. |
| `host` | string | Redis host. |
| `port` | number | Redis port. |
| `url` | string | Redis URL; overrides `host` and `port`. |
| `pin` / `pins` | string, object, or array | Restrict the listener or client to these patterns. Each pin gets its own channel pair. See [Route messages with pins](../how-to/route-messages-with-pins.md). |

A `topic` setting is not read: channel names come only from the pins
(see [How the transport works](../explanation/how-it-works.md#channels)).

The seneca-transport option `msgprefix` (default `'seneca_'`) is the
prefix of every channel name.
