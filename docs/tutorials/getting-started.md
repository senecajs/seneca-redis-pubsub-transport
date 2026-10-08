# Getting started

In this tutorial you run a Seneca service and a Seneca client that send
messages to each other through Redis pub/sub.

## Install

You need Node 22 or 24, and a Redis server. This repository's
`docker-compose.yml` starts Redis 8.10 on host port 16382:

```sh
npm run services:up
```

In your own project install Seneca, seneca-transport and this plugin:

```sh
npm install seneca seneca-transport @seneca/redis-pubsub-transport redis@2
```

Seneca 4 has no network transport in its core, and this plugin uses the
utilities that `seneca-transport` exports, so load `seneca-transport`
before this plugin.

## The program

Save this as `getting-started.js` (it is
[docs/examples/getting-started.js](../examples/getting-started.js)):

```js
const Seneca = require('seneca')

const redis = {
  type: 'redis',
  host: process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.SENECA_TEST_REDIS_PORT || '16382', 10),
}

const service = Seneca({ log: 'silent' })
  .use('seneca-transport')
  .use(require('../..')) // in your project: .use('@seneca/redis-pubsub-transport')
  .add('color:red', function (msg, reply) {
    reply(null, { hex: '#FF0000', name: msg.name })
  })
  .listen(redis)

service.ready(function () {
  const client = Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(require('../..'))
    .client(redis)

  client.ready(function () {
    client.act('color:red,name:rose', function (err, out) {
      if (err) throw err
      console.log('reply:', out)

      client.close(function () {
        service.close(function () {
          console.log('closed')
        })
      })
    })
  })
})
```

Run it:

```sh
node docs/examples/getting-started.js
```

Output (Seneca 4.0.0-rc5, Node 24):

```
reply: { hex: '#FF0000', name: 'rose' }
closed
```

## What happens

1. `listen({type: 'redis', ...})` makes the service subscribe to the Redis
   channel `seneca_any_act`.
2. `client({type: 'redis', ...})` makes the client subscribe to
   `seneca_any_res`. Every message the client cannot handle locally is
   published on `seneca_any_act`.
3. The service runs `color:red` and publishes the reply on
   `seneca_any_res`. The client matches it to the original call.
4. `close()` quits the Redis connections, so the process exits.

## Next steps

* [Route messages with pins](../how-to/route-messages-with-pins.md).
* [Configure the Redis connection](../how-to/configure-the-redis-connection.md).
* [How the transport works](../explanation/how-it-works.md).
