# 0.4.0

- Support the Seneca 4 prerelease (4.0.0-rc5) and 4.0.0: register the
  close action on `sys:seneca,cmd:close` under Seneca 4 so Redis
  connections are released and the process exits. Load
  `seneca-transport` before this plugin on Seneca 4.
- Test on Node 24 and 22 against Redis 8.10 (docker compose, host port
  16382; `npm run services:up` / `services:down`).
- Replace lab 11 and seneca-transport-test with `node:test`.
- Remove Travis, coveralls, eslint and pre-commit tooling; add a GitHub
  Actions workflow as a patch in `.patches/`.
- Reorganize documentation in Diataxis form under `docs/`.

# [WIP]

- Allow to connect to redis server via url PR#21
- Update redis to 2.6.2 PR#21
- Changed to seneca-redis-pubsub-transport PR#24