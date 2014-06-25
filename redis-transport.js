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
  var msgprefix = so.transport.msgprefix

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
    var seneca = this
    var listen_options = _.extend({},options[args.type],args)
    //console.log('LISTEN OPTS',listen_options)

    var redis_in  = redis.createClient(listen_options.port,listen_options.host)
    var redis_out = redis.createClient(listen_options.port,listen_options.host)

    redis_in.on('message',function(channel,msgstr){
      var restopic = channel.replace(/_req$/,'_res')

      try {
        var data = JSON.parse(msgstr)
      }
      catch(e) {
        // TODO: standardize this over transports
        seneca.log.error('json-parse',e,msgstr)
      }

      tu.handle_request( seneca, data, listen_options, function(out){
        if( out ) {
          var outstr = JSON.stringify(out)
          //console.log('PUBLISH RES '+restopic+' '+outstr)
          redis_out.publish(restopic,outstr)
        }
      })

      /*
      if( 'act' == data.kind ) {
        var output = tu.prepare_response( seneca, data )

        try {
          var inargs = tu.handle_entity( data.act )
          seneca.act( data.act, function( err, out ) {
            tu.update_output( output, err, out )

            var outstr = JSON.stringify( output )
            redis_out.publish( restopic, outstr )
          })
        }
        catch(e) {
          tu.catch_act_error( seneca, e, listen_options, data, output )

          var outstr = JSON.stringify(output)
          //console.log('PUBLISH RES '+restopic+' '+outstr)
          redis_out.publish(restopic,outstr)
        }
      }
      else {
        seneca.log.error('listen', 'kind-error', listen_options, seneca, 'not-act', channel, data)
      }
       */
    })


    tu.listen_topics( seneca, args, listen_options, function(topic) {
      var reqtopic = topic+'_req'
      //console.log('SUBSCRIBE REQ '+reqtopic)
      redis_in.subscribe( reqtopic )
    })


    seneca.log.info('listen', 'open', listen_options, seneca)

    done()
  }



  function hook_client_redis( args, clientdone ) {
    var seneca = this
    var client_options = _.extend({},options[args.type],args)
    //console.log('CLIENT OPTS',client_options)


    //tu.make_client( make_send, args, client_options, clientdone )


    var client = tu.make_anyclient(make_send({},'any'))


    var pins = tu.resolve_pins(args)
    if( pins ) {
      var argspatrun  = tu.make_argspatrun(pins)
      var resolvesend = tu.make_resolvesend({},make_send)

      client = tu.make_pinclient( resolvesend, argspatrun )
    }

    seneca.log.info('client', 'redis', client_options, pins||'any', seneca)
    clientdone(null,client)



    function make_send( spec, topic ) {
      var redis_in  = redis.createClient(args.port,args.host)
      var redis_out = redis.createClient(args.port,args.host)

      redis_in.on('message',function(channel,msgstr){

        // TODO: export parseJSON, stringifyJSON, safe versions
        var input = JSON.parse(msgstr)
        tu.handle_response( seneca, input, client_options )
      })

      redis_in.subscribe(msgprefix+topic+'_res')

      return function( args, done ) {
        var outmsg = tu.prepare_request( this, args, done )

        var outstr   = JSON.stringify(outmsg)
        var reqtopic = msgprefix+topic+'_req'
        //console.log('PUBLISH '+reqtopic+' '+outstr)
        redis_out.publish(reqtopic,outstr)
      }
    }
  }  


  return {
    name: plugin,
  }
}
