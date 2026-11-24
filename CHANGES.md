# Changes

## 1.0.0 2026-11-20

First version published as `@seneca/redis-pubsub-transport`. Versions up
to 0.3.0 were published as `seneca-redis-transport`. Version 0.4.0 was
never published; its changes, and the earlier unreleased work, are part
of this release.

* Seneca 4: the peer dependencies are `seneca` `^4.0.0` and
  `@seneca/transport` `^9.0.0`. Seneca 3 is no longer supported; Seneca 3
  users stay on `seneca-redis-transport@0.3`.
* Renamed from `seneca-redis-transport` to
  `@seneca/redis-pubsub-transport` (PR #24). Load it by this full name:
  the short name `redis-transport` finds the old package if it is
  installed.
* Node.js 24 or later (`engines.node` `>=24`).
* Load `@seneca/transport` before this plugin, because Seneca 4 has no
  network transport in its core. Without it the plugin now fails to load
  with a message that says so, instead of a `TypeError` at the first
  `listen` or `client`.
* The close action is registered on `sys:seneca,cmd:close`, so the Redis
  connections are released and the process exits on `close()`.
* The legacy type `pubsub` is removed. The transport plugin rejects that
  type with `plugin-needed` before this plugin sees it, on Seneca 3 as on
  Seneca 4. Use `type: 'redis'`.
* Options are merged with `seneca.util.deep` in place of the deprecated
  `seneca.util.deepextend` (D2).
* Connect with a Redis URL, the `url` option (PR #21).
* `redis` 2.6.2 (PR #21). `lodash` moves from the 4.14.1 pin to
  `^4.17.21`, which fixes known prototype-pollution advisories.
* Tests use `node:test` in place of lab 11 and seneca-transport-test,
  against Redis (`npm run services:up` starts `redis:8.10` on host port
  16382); tested on Node.js 26 with Redis 7. CI is provided as a patch
  in `.patches/`.
* The committed `.npmrc` that set `legacy-peer-deps` is removed.
* Travis, coveralls, eslint and pre-commit tooling removed;
  documentation reorganized in Diátaxis form under `docs/`.
