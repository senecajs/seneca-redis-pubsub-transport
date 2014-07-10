/* Copyright (c) 2014 Richard Rodger, MIT License */
"use strict";


var buffer = require('buffer')
var util   = require('util')
var net    = require('net')
var stream = require('stream')


var _        = require('underscore')
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
    var listen_options = seneca.util.clean(_.extend({},options[type],args))

    var redis_in  = redis.createClient(listen_options.port,listen_options.host)
    var redis_out = redis.createClient(listen_options.port,listen_options.host)

    handle_events(redis_in)
    handle_events(redis_out)

    redis_in.on('message',function(channel,msgstr){
      var restopic = channel.replace(/_act$/,'_res')
      var data     = tu.parseJSON( seneca, 'listen-'+type, msgstr )

      tu.handle_request( seneca, data, listen_options, function(out){
        if( null == out ) return;
        var outstr = tu.stringifyJSON( seneca, 'listen-'+type, out )
        redis_out.publish(restopic,outstr)
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
        var outstr = tu.stringifyJSON( seneca, 'client-redis', outmsg )

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
