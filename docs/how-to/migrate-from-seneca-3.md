# Migrate from Seneca 3

Goal: run an existing service that uses this plugin on Seneca 4.

1. Replace `seneca-redis-transport` with this package, and install
   `@seneca/transport`. Seneca 3 had a network transport built in;
   Seneca 4 does not:

   ```sh
   npm uninstall seneca-redis-transport
   npm install seneca@^4 @seneca/transport @seneca/redis-pubsub-transport
   ```

2. Load both by their full names, `@seneca/transport` first:

   ```js
   seneca.use('@seneca/transport').use('@seneca/redis-pubsub-transport')
   ```

   Do not load this plugin as `redis-transport`: that short name finds
   the old `seneca-redis-transport` package if it is installed. Versions
   before 1.0.0 register their close action on `role:seneca,cmd:close`
   only, which Seneca 4 does not call, so `close()` leaves the Redis
   connections open and the process does not exit.

3. Use `type: 'redis'`. The legacy type `pubsub` is removed: the
   transport plugin rejects it with `plugin-needed` before this plugin
   sees it, on Seneca 3 as on Seneca 4.

4. Keep your options. The top level `transport: { redis: {...} }`
   option and the `use()` options work as before.

5. Remove options under `legacy` other than `meta` and
   `builtin_actions`. Seneca 4 ignores the other Seneca 3 flags and
   `legacy.error`, and warns that they are deprecated.
