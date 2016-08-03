/* Copyright (c) 2014-2015 Richard Rodger */
'use strict'

var Lab = require('lab')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it

var SenecaTransportTest = require('seneca-transport-test')

describe('redis-transport', function () {
  it('happy-any', function (fin) {
    SenecaTransportTest.foo_test('', require, fin, 'redis', -6379)
  })

  it('happy-pin', function (fin) {
    SenecaTransportTest.foo_pintest('', require, fin, 'redis', -6379)
  })
})
