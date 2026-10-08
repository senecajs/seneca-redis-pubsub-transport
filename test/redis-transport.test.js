/* Copyright (c) 2014-2026 Richard Rodger */
'use strict'

var { describe, it } = require('node:test')
var Support = require('./support')

function cb (fn) {
  return function () {
    return new Promise(function (resolve, reject) {
      fn(function (err) { err ? reject(err) : resolve() })
    })
  }
}

describe('redis-transport', function () {
  it('happy-any', cb(Support.foo_test))

  it('happy-pin', cb(Support.foo_pintest))
})
