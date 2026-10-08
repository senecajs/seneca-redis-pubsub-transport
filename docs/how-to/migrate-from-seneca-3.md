# Migrate from Seneca 3

Goal: run an existing service that uses this plugin on Seneca 4.

1. Install `seneca-transport` (`npm install seneca-transport`) and load it
   before this plugin. Seneca 3 had it built in; Seneca 4 does not:

   ```js
   seneca.use('seneca-transport').use('@seneca/redis-pubsub-transport')
   ```

2. Upgrade this plugin to 0.4.0 or later. Earlier versions register
   their close action on `role:seneca,cmd:close` only, which Seneca
   4.0.0-rc5 does not call, so `close()` leaves the Redis connections
   open and the process does not exit.

3. Keep your options. The top level `transport: { redis: {...} }`
   option and the `use()` options work as before.

4. Remove options under `legacy` other than `error`, `meta` and
   `builtin_actions`; Seneca 4 rejects them.
