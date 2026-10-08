# Configure the Redis connection

Goal: point the transport at your Redis server.

1. Per call, pass `host` and `port` (or `url`) to `listen()` and
   `client()`:

   ```js
   seneca.listen({ type: 'redis', host: 'redis.internal', port: 6379 })
   seneca.client({ type: 'redis', url: 'redis://:secret@redis.internal:6379/0' })
   ```

2. For every call of the instance, use plugin options:

   ```js
   seneca
     .use('seneca-transport')
     .use('@seneca/redis-pubsub-transport', { redis: { host: 'redis.internal' } })
   ```

3. Or set the top level `transport` option of the instance:

   ```js
   const seneca = require('seneca')({
     transport: { redis: { url: 'redis://redis.internal:6379' } },
   })
   ```

A `url` overrides `host` and `port`. Per-call settings win over plugin
options. See [Options](../reference/options.md) for the full list.
