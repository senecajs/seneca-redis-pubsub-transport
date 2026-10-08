// A service and a client in one process, talking over Redis pub/sub.
// Start Redis first: npm run services:up (host port 16382).
'use strict'

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
