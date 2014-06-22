/* Copyright (c) 2014 Richard Rodger, MIT License */
"use strict";


var buffer = require('buffer')
var util   = require('util')
var net    = require('net')
var stream = require('stream')


var _ = require('underscore')




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
  


  seneca.add({role:'transport',hook:'listen',type:'redis'}, hook_listen_redis)
  seneca.add({role:'transport',hook:'client',type:'redis'}, hook_client_redis)




  function hook_listen_redis( args, done ) {
    var seneca = this
    var listen_options = _.extend({},options[args.type],args)
    console.log('LISTEN OPTS',listen_options)

    done()
  }



  function hook_client_redis( args, clientdone ) {
    var seneca = this
    var client_options = _.extend({},options[args.type],args)
    console.log('CLIENT OPTS',client_options)

    done()
  }  


  return {
    name: plugin,
  }
}
