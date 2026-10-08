# @seneca/redis-pubsub-transport

A [Seneca](https://www.npmjs.com/package/seneca) transport plugin that
sends messages over [Redis](https://redis.io/) pub/sub. It is a broadcast
transport: every subscribed service receives every message. Works with
Seneca 4 (tested with 4.0.0-rc5 and 4.0.0) and Seneca 3, on Node 24 and
22, with Redis 8.

[![npm version](https://img.shields.io/npm/v/@seneca/redis-pubsub-transport.svg)](https://npmjs.com/package/@seneca/redis-pubsub-transport)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install seneca seneca-transport @seneca/redis-pubsub-transport redis@2
```

You also need a running Redis server.

## Quick Example

```js
const Seneca = require('seneca')

Seneca()
  .use('seneca-transport') // Seneca 4 has no network transport in core
  .use('@seneca/redis-pubsub-transport')
  .add('color:red', function (msg, reply) {
    reply(null, { hex: '#FF0000' })
  })
  .listen({ type: 'redis', host: '127.0.0.1', port: 6379 })

Seneca()
  .use('seneca-transport')
  .use('@seneca/redis-pubsub-transport')
  .client({ type: 'redis', host: '127.0.0.1', port: 6379 })
  .act('color:red', console.log)
```

A complete program that also closes both instances is in
[docs/examples/getting-started.js](docs/examples/getting-started.js).

## More Examples

* [Getting started](docs/tutorials/getting-started.md) tutorial.
* [Configure the Redis connection](docs/how-to/configure-the-redis-connection.md).
* [Route messages with pins](docs/how-to/route-messages-with-pins.md).
* [Migrate from Seneca 3](docs/how-to/migrate-from-seneca-3.md).
* [Run the tests locally](docs/how-to/run-the-tests-locally.md).

All documentation: [docs/README.md](docs/README.md).

## Motivation

Redis pub/sub is a simple way to connect Seneca services that already
share a Redis server, and to broadcast messages to several services at
once. See [How the transport works](docs/explanation/how-it-works.md).

## Support

* Report problems as [GitHub issues](https://github.com/senecajs/seneca-redis-pubsub-transport/issues).
* Seneca documentation: [senecajs/seneca docs](https://github.com/senecajs/seneca/tree/master/docs).
* This plugin is sponsored by [Voxgig](https://www.voxgig.com).

## API

| Pattern | Sent by | Reference |
| ------- | ------- | --------- |
| `role:transport,hook:listen,type:redis` | `seneca.listen({type:'redis'})` | [Messages](docs/reference/messages.md) |
| `role:transport,hook:client,type:redis` | `seneca.client({type:'redis'})` | [Messages](docs/reference/messages.md) |
| `type:pubsub` variants (legacy) | `listen`/`client` with `type:'pubsub'` | [Messages](docs/reference/messages.md#legacy-type-pubsub) |

| Option | Default | Reference |
| ------ | ------- | --------- |
| `redis.host` | `'localhost'` | [Options](docs/reference/options.md) |
| `redis.port` | `6379` | [Options](docs/reference/options.md) |
| `redis.url` | none | [Options](docs/reference/options.md) |
| `redis.timeout` | Seneca `timeout` minus 555 | [Options](docs/reference/options.md) |

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open
participation. To run the tests (Node 24 or 22, Seneca 4 prerelease as
devDependency):

```sh
npm run services:up   # Redis 8.10 on host port 16382
npm install
npm test
npm run services:down
```

Details: [Run the tests locally](docs/how-to/run-the-tests-locally.md).
The GitHub Actions workflow is delivered as a patch in
[.patches](.patches/README.md); apply it with `git am .patches/*.patch`.

## Background

The plugin started in 2014 as an example of a Seneca transport and was
renamed from seneca-redis-transport to seneca-redis-pubsub-transport.
See [CHANGES.md](CHANGES.md).

| Plugin version | Seneca | Node |
| -------------- | ------ | ---- |
| 0.4.x | 4 (with seneca-transport 8), 3 | 24, 22 |
| 0.3.x | 3 and earlier | 4 to 6 (Travis era) |

License: [MIT](LICENSE).
