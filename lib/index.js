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
    // if Redis url is provided use it instead for production secure redis server
    const redis_in = opts.url
      ? Redis.createClient({ url: opts.url })
      : Redis.createClient(opts.port, opts.host)
    const redis_out = opts.url
      ? Redis.createClient({ url: opts.url })
      : Redis.createClient(opts.port, opts.host)

    handle_events(redis_in)
    handle_events(redis_out)

    function handle_events(redisclient) {
      // Die if you can't connect initially
      redisclient.on('ready', () => {
        redisclient.on('error', (err) => {
          seneca.log.error('transport', 'redis', err)
        })
      })
    }

    return { redis_in, redis_out }
  }

  function hook_listen_redis(args, done) {
    const seneca = this
    const type = args.type
    const listen_options = seneca.util.clean({ ...options[type], ...args })
    const { redis_in, redis_out } = get_redis_client(listen_options)

    redis_in.on('message', (channel, msgstr) => {
      const restopic = channel.replace(/_act$/, '_res')
      const data = tu.parseJSON(seneca, 'listen-' + type, msgstr)
      seneca.log.debug('listen', 'message', restopic, data)

      tu.handle_request(seneca, data, listen_options, function(out) {
        if (out == null) return
        const outstr = tu.stringifyJSON(seneca, 'listen-' + type, out)
        redis_out.publish(restopic, outstr)
      })
    })

    const topics = tu.listen_topics(seneca, args, listen_options)
    seneca.log.debug('listen', 'topics', topics)

    redis_in.on('subscribe', (channel, count) => {
      seneca.log.debug('listen', 'subscribed', channel)
      if (count === topics.length) {
        seneca.log.debug('listen', 'open')
        done()
      }
    })

    topics.forEach(function(topic) {
      seneca.log.debug('listen', 'subsribe', topic + '_act')
      redis_in.subscribe(topic + '_act')
    })

    seneca.add('role:seneca,cmd:close', function(close_args, done) {
      const closer = this

      redis_in.quit()
      redis_out.quit()
      closer.prior(close_args, done)
    })
  }

  function hook_client_redis(args, clientdone) {
    const seneca = this
    const type = args.type
    const client_options = seneca.util.clean({ ...options[type], ...args })
    const { redis_in, redis_out } = get_redis_client(client_options)


    // pull out all the topics we want to subscribe to
    // subscribe to all provided topics in redis

    const pins = tu.resolve_pins(client_options)
    const topics = pins.map(pin =>
      tu.resolve_topic(client_options, { pin }, pin)
    )

    pins.forEach(pin => {
      const topic = tu.resolve_topic(client_options, { pin }, pin) // use itself as default
      redis_in.subscribe(topic + '_res')
    })

    // once we've successfully subscribed, call into make_client to finish up.
    redis_in.on('subscribe', (channel, count) => {
      seneca.log.debug('client', 'subscribe', channel)
      if (count === pins.length) {
        seneca.log.debug('client', 'open')
        tu.make_client(seneca, make_send, client_options, clientdone)
      }
    })

    redis_in.on('message', function(channel, msgstr) {
      const input = tu.parseJSON(seneca, 'client-' + type, msgstr)
      seneca.log.debug('client', 'message', channel, msgstr)
      if (seneca.id === input.origin) {
        tu.handle_response(seneca, input, client_options)
      }
    })

    function make_send(spec, topic, send_done) {
      send_done(null, function(args, done, meta) {
        const outmsg = tu.prepare_request(this, args, done, meta)
        const outstr = tu.stringifyJSON(seneca, 'client-' + type, outmsg)
        seneca.log.debug('client', 'publish', outmsg, outstr)
        redis_out.publish(topic + '_act', outstr)
      })

      seneca.add('role:seneca,cmd:close', function(close_args, done) {
        redis_in.quit()
        redis_out.quit()
        this.prior(close_args, done)
      })
    }
  }

  return {
    name: plugin
  }
}
