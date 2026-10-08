// Route different patterns to different listeners with pins, and show
// the Redis channels the plugin subscribes to.
// Start Redis first: npm run services:up (host port 16382).
'use strict'

const Seneca = require('seneca')
const Redis = require('redis')

const host = process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1'
const port = parseInt(process.env.SENECA_TEST_REDIS_PORT || '16382', 10)
const redis = { type: 'redis', host, port }

const service = Seneca({ log: 'silent' })
  .use('seneca-transport')
  .use(require('../..'))
  .add('role:math,cmd:sum', function (msg, reply) {
    reply(null, { answer: msg.left + msg.right })
  })
  .add('role:text,cmd:upper', function (msg, reply) {
    reply(null, { answer: msg.text.toUpperCase() })
  })
  .listen({ ...redis, pin: 'role:math,cmd:*' })
  .listen({ ...redis, pin: 'role:text,cmd:*' })

service.ready(function () {
  const client = Seneca({ log: 'silent' })
    .use('seneca-transport')
    .use(require('../..'))
    .client({ ...redis, pin: 'role:math,cmd:*' })
    .client({ ...redis, pin: 'role:text,cmd:*' })

  client.ready(function () {
    client.act('role:math,cmd:sum,left:1,right:2', function (err, sum) {
      if (err) throw err
      client.act('role:text,cmd:upper,text:hi', function (err, upper) {
        if (err) throw err
        console.log('sum:', sum)
        console.log('upper:', upper)

        const admin = Redis.createClient(port, host)
        admin.pubsub('channels', function (err, channels) {
          if (err) throw err
          console.log('channels:', channels.sort())
          admin.quit()
          client.close(function () {
            service.close(function () {
              console.log('closed')
            })
          })
        })
      })
    })
  })
})
