/* Copyright (c) 2014-2015 Richard Rodger */
"use strict";


// mocha redis-transport.test.js

var test = require('seneca-transport-test')


describe('redis-transport', function() {

  it('happy-any', function( fin ) {
    test.foo_test( 'redis-transport', require, fin, 'redis', -6379 )
  })

  it('happy-pin', function( fin ) {
    test.foo_pintest( 'redis-transport', require, fin, 'redis', -6379 )
  })

})
