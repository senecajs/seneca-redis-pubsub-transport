/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
'use strict'

const Redis = require('redis')

module.exports = function(options) {
  const seneca = this
  const plugin = 'redis-transport'

  const so = seneca.options()

  options = seneca.util.deepextend(
    {
      redis: {
        timeout: so.timeout ? so.timeout - 555 : 22222,
        type: 'redis',
        host: 'localhost',
        port: 6379
      }
    },
    so.transport,
    options
  )

  const tu = seneca.export('transport/utils')

  seneca.add(
    { role: 'transport', hook: 'listen', type: 'redis' },
    hook_listen_redis
  )
  seneca.add(
    { role: 'transport', hook: 'client', type: 'redis' },
    hook_client_redis
  )

  // Legacy patterns
  seneca.add(
    { role: 'transport', hook: 'listen', type: 'pubsub' },
    hook_listen_redis
  )
  seneca.add(
    { role: 'transport', hook: 'client', type: 'pubsub' },
    hook_client_redis
  )

  function get_redis_client(opts) {
    const redis_in = get_client()
    const redis_out = get_client()
    return {
      redis_in,
      redis_out,
      closer(done) {
        redis_in.quit()
        redis_out.quit()
        done()
      }
    }

    function get_client() {
      const client = opts.url
        ? Redis.createClient({ url: opts.url })
        : Redis.createClient(opts.port, opts.host)

      // Die if you can't connect initially
      client.on('ready', () => {
        client.on('error', err => {
          seneca.log.error('transport', 'redis', err)
        })
      })

      return client
    }
  }

  function hook_listen_redis(args, done) {
    const seneca = this
    const type = args.type
    const listen_options = seneca.util.clean({ ...options[type], ...args })
    const { redis_in, redis_out, closer } = get_redis_client(listen_options)

    redis_in.on('message', (channel, msgstr) => {
      const restopic = channel.replace(/_act$/, '_res')
      const data = tu.parseJSON(seneca, 'listen-' + type, msgstr)
      seneca.log.debug('listen', 'message', restopic, data)

      tu.handle_request(seneca, data, listen_options, outmsg => {
        const outstr = tu.stringifyJSON(seneca, 'listen-' + type, outmsg)
        seneca.log.debug('client', 'publish', outmsg, outstr)
        redis_out.publish(restopic, outstr)
      })
    })

    let listen_count = 0

    tu.listen_topics(seneca, args, listen_options)
      .map(topic => topic + '_act')
      .forEach(topic => {
        listen_count += 1
        seneca.log.debug('listen', 'subsribe', topic)
        redis_in.subscribe(topic)
      })

    redis_in.on('subscribe', (channel, count) => {
      seneca.log.debug('listen', 'subscribed', channel)
      if (count === listen_count) {
        seneca.log.debug('listen', 'open')
        done()
      }
    })

    tu.close(seneca, closer)
  }

  function hook_client_redis(args, clientdone) {
    const seneca = this
    const type = args.type
    const client_options = seneca.util.clean({ ...options[type], ...args })
    const { redis_in, redis_out, closer } = get_redis_client(client_options)

    redis_in.on('message', (channel, msgstr) => {
      const input = tu.parseJSON(seneca, 'client-' + type, msgstr)
      seneca.log.debug('client', 'redis', 'message', channel, msgstr)
      if (seneca.id === input.origin) {
        tu.handle_response(seneca, input, client_options)
      }
    })

    // pull out all the topics we want to subscribe to
    // subscribe to all provided topics in redis

    let client_count = 0

    tu.resolve_pins(client_options)
      .map(pin => tu.resolve_topic(client_options, { pin }, pin))
      .map(topic => topic + '_res')
      .forEach(topic => {
        client_count += 1
        seneca.log.debug('client', 'subsribe', topic)
        redis_in.subscribe(topic)
      })

    // once we've successfully subscribed, call into make_client to finish up.
    redis_in.on('subscribe', (channel, count) => {
      seneca.log.debug('client', 'subscribed', channel)
      if (count === client_count) {
        seneca.log.debug('client', 'open')
        tu.make_client(seneca, make_send, client_options, clientdone)
      }
    })

    function make_send(spec, topic, send_done) {
      send_done(null, (args, done, meta) => {
        const outmsg = tu.prepare_request(seneca, args, done, meta)
        const outstr = tu.stringifyJSON(seneca, 'client-' + type, outmsg)
        seneca.log.debug(
          'client',
          'redis',
          'send',
          spec,
          topic,
          client_options,
          outstr
        )
        redis_out.publish(topic + '_act', outstr)
      })

      tu.close(seneca, closer)
    }
  }

  return {
    name: plugin
  }
}
