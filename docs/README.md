# @seneca/redis-pubsub-transport documentation

The documentation follows the [Diátaxis](https://diataxis.fr/) structure.
Start with the tutorial, use the how-to guides for specific tasks, look
things up in the reference, and read the explanation to understand the
design.

## Tutorials

| Tutorial | What you build |
| -------- | -------------- |
| [Getting started](tutorials/getting-started.md) | A service and a client that talk over Redis pub/sub. |

The programs are in [examples](examples/).

## How-to guides

| Guide | Covers |
| ----- | ------ |
| [Configure the Redis connection](how-to/configure-the-redis-connection.md) | Host and port, Redis URLs, plugin and per-call settings. |
| [Route messages with pins](how-to/route-messages-with-pins.md) | One channel pair per pattern, several listeners. |
| [Migrate from Seneca 3](how-to/migrate-from-seneca-3.md) | Loading seneca-transport, options, closing. |
| [Run the tests locally](how-to/run-the-tests-locally.md) | Docker Compose, environment variables, Node versions. |
| [Create a release](how-to/create-a-release.md) | Maintainer release steps. |

## Reference

| Page | Contents |
| ---- | -------- |
| [Options](reference/options.md) | Plugin options and per-call connection settings. |
| [Messages](reference/messages.md) | The transport hook patterns and the Redis channels used. |

## Explanation

| Page | Contents |
| ---- | -------- |
| [How the transport works](explanation/how-it-works.md) | Channels, broadcast delivery, lifecycle, Seneca 3 versus 4, limits. |

## Feature index

| Feature | Kind | Documented in |
| ------- | ---- | ------------- |
| `redis.type` | option | [Options](reference/options.md#plugin-options) |
| `redis.host` | option | [Options](reference/options.md#plugin-options) |
| `redis.port` | option | [Options](reference/options.md#plugin-options) |
| `redis.timeout` | option | [Options](reference/options.md#plugin-options) |
| `url` | option / per-call setting | [Options](reference/options.md#per-call-settings) |
| `pin` / `pins` | per-call setting | [Options](reference/options.md#per-call-settings) |
| Top level `transport` options | option source | [Options](reference/options.md#where-options-come-from) |
| `role:transport,hook:listen,type:redis` | action pattern | [Messages](reference/messages.md#roletransporthooklistentyperedis) |
| `role:transport,hook:client,type:redis` | action pattern | [Messages](reference/messages.md#roletransporthookclienttyperedis) |
| `role:transport,hook:listen,type:pubsub` | action pattern (legacy) | [Messages](reference/messages.md#legacy-type-pubsub) |
| `role:transport,hook:client,type:pubsub` | action pattern (legacy) | [Messages](reference/messages.md#legacy-type-pubsub) |
| Close hook (`sys:seneca,cmd:close` / `role:seneca,cmd:close`) | action pattern | [Messages](reference/messages.md#close-hook) |
| Plugin name `redis-transport` | export | [Messages](reference/messages.md#plugin-name-and-exports) |
| Error codes | none defined | [Messages](reference/messages.md#errors) |
