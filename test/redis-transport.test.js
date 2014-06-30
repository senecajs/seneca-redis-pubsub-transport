/* Copyright (c) 2014 Richard Rodger */
"use strict";


// mocha redis-transport.test.js

var test = require('seneca-transport-test')


describe('redis-transport', function() {

  it('happy', function( fin ) {
    test.foo_test( require, fin, 'redis' )
  })

})
