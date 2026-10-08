# Run the tests locally

Goal: run `npm test` against a real Redis server.

1. Start Redis 8.10 with Docker Compose (container
   `seneca-redis-pubsub-transport-redis`, host port 16382):

   ```sh
   npm run services:up
   ```

2. Install and test with Node 24 (or 22):

   ```sh
   npm install
   npm test
   ```

   `npm test` does not start Docker. It reads these environment
   variables:

   | Variable | Default |
   | -------- | ------- |
   | `SENECA_TEST_REDIS_HOST` | `127.0.0.1` |
   | `SENECA_TEST_REDIS_PORT` | `16382` |

3. Optionally test against another Seneca build, then restore:

   ```sh
   npm install --no-save /path/to/seneca-4.0.0.tgz
   npm test
   npm install
   ```

4. Stop Redis and remove its volumes:

   ```sh
   npm run services:down
   ```

`test/fault.js` is a manual script (not run by `npm test`) that keeps
sending messages while the service is closed and restarted:
`node test/fault.js [speed]`. Stop it with Ctrl-C.

GitHub CI runs the same tests with Redis as a service container on the
same port; the workflow is in [.patches](../../.patches/README.md).
