/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
"use strict";


var buffer = require('buffer')
var util   = require('util')
var net    = require('net')
var stream = require('stream')


var _        = require('lodash')
var redis    = require('redis')


module.exports = function( options ) {
  var seneca = this
  var plugin = 'redis-transport'

  var so = seneca.options()

  options = seneca.util.deepextend(
    {
      redis: {
        timeout:  so.timeout ? so.timeout-555 :  22222,
        type:     'redis',
        host:     'localhost',
        port:     6379,
      },
    },
    so.transport,
    options)


  var tu = seneca.export('transport/utils')


  seneca.add({role:'transport',hook:'listen',type:'redis'}, hook_listen_redis)
  seneca.add({role:'transport',hook:'client',type:'redis'}, hook_client_redis)

  // Legacy patterns
  seneca.add({role:'transport',hook:'listen',type:'pubsub'}, hook_listen_redis)
  seneca.add({role:'transport',hook:'client',type:'pubsub'}, hook_client_redis)



  function hook_listen_redis( args, done ) {
    var seneca         = this
    var type           = args.type
    var handle         = args.handle
    var listen_options = seneca.util.clean(_.extend({},options[type],args))

    var redis_in  = redis.createClient(listen_options.port,listen_options.host)
    var redis_out = redis.createClient(listen_options.port,listen_options.host)
    var redis_sync = redis.createClient(listen_options.port,listen_options.host)

    handle_events(redis_in)
    handle_events(redis_out)
    handle_events(redis_sync)

    var handle_values = {
      once: 'once'
    }

    function sync_handle(msgid,done) {
      if (handle === handle_values.once) {
        redis_sync.incr('seneca/transport/'+msgid, function (err, result) {
          if (err) {
            seneca.log.error('transport','redis-sync-key-incr',err)
            return done(err)
          }
          return done(null,1===result)
        })
      }
      else {
        return done(null,true)
      }
    }

    function post_handle(msgid) {
      if (handle === handle_values.once) {
        redis_sync.expire('seneca/transport/'+msgid, 60, function(err, result) {
          if (err || 1!==result) {
            seneca.log.error('transport','redis-sync-key-set-expire',err || new Error('expected 1 got ' + result))
          }
        })
      }
    }

    redis_in.on('message',function(channel,msgstr){
      var restopic = channel.replace(/_act$/,'_res')
      var data     = tu.parseJSON( seneca, 'listen-'+type, msgstr )

      var msgid = data.origin+'/'+data.id
      sync_handle(msgid,function(err, handle){
        if (handle) {
          tu.handle_request( seneca, data, listen_options, function(out){
            if( null == out ) return;
            var outstr = tu.stringifyJSON( seneca, 'listen-'+type, out )
            redis_out.publish(restopic,outstr)
            post_handle(msgid)
          })
        }
      })
    })

    tu.listen_topics( seneca, args, listen_options, function(topic) {
      seneca.log.debug('listen', 'subscribe', topic+'_act', listen_options, seneca)
      redis_in.subscribe( topic+'_act' )
    })


    seneca.add('role:seneca,cmd:close',function( close_args, done ) {
      var closer = this

      redis_in.end()
      redis_out.end()
      redis_sync.end()
      closer.prior(close_args,done)
    })


    seneca.log.info('listen', 'open', listen_options, seneca)

    done()
  }


  function hook_client_redis( args, clientdone ) {
    var seneca         = this
    var type           = args.type
    var client_options = seneca.util.clean(_.extend({},options[type],args))

    tu.make_client( make_send, client_options, clientdone )

    function make_send( spec, topic, send_done ) {
      var redis_in  = redis.createClient(client_options.port,client_options.host)
      var redis_out = redis.createClient(client_options.port,client_options.host)

      handle_events(redis_in)
      handle_events(redis_out)

      redis_in.on('message',function(channel,msgstr){
        var input = tu.parseJSON(seneca,'client-'+type,msgstr)
        tu.handle_response( seneca, input, client_options )
      })

      seneca.log.debug('client', 'subscribe', topic+'_res', client_options, seneca)
      redis_in.subscribe( topic+'_res' )

      send_done( null, function( args, done ) {
        var outmsg = tu.prepare_request( this, args, done )
        var outstr = tu.stringifyJSON( seneca, 'client-'+type, outmsg )

        redis_out.publish( topic+'_act', outstr )
      })

      seneca.add('role:seneca,cmd:close',function( close_args, done ) {
        var closer = this

        redis_in.end()
        redis_out.end()
        closer.prior(close_args,done)
      })

    }
  }


  function handle_events( redisclient ) {
    // Die if you can't connect initially
    redisclient.on('ready', function() {
      redisclient.on('error', function(err){
        seneca.log.error('transport','redis',err)
      })
    })
  }

  return {
    name: plugin,
  }
}
