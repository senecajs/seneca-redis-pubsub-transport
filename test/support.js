/* Copyright (c) 2014-2026 Richard Rodger and other contributors, MIT License */
'use strict'

// Test helpers adapted from seneca-transport-test@0.1.3 (foo_test,
// foo_pintest, foo_fault), which no longer works with Seneca 4.

var Assert = require('assert')
var Seneca = require('seneca')

var REDIS_HOST = process.env.SENECA_TEST_REDIS_HOST || '127.0.0.1'
var REDIS_PORT = parseInt(process.env.SENECA_TEST_REDIS_PORT || '16382', 10)

var fafmap = {}

function make_seneca () {
  return Seneca({ log: 'silent' })
    .use('seneca-transport') // Seneca 4 has no network transport in core.
    .use(require('..'))
}

function foo_plugin () {
  this.add('foo:1', function (args, done) { done(null, { dee: '1-' + args.bar }) })
  this.add('foo:2', function (args, done) { done(null, { dee: '2-' + args.bar }) })
  this.add('nores:1', function (args, done) { done() })
  this.add('faf:1', function (args, done) { fafmap[args.k] = args.v; done() })
  this.add('role:a,cmd:1', function (args, done) { done(null, { out: 'a1-' + args.bar }) })
  this.add('role:b,cmd:2', function (args, done) { done(null, { out: 'b2-' + args.bar }) })
}

function conn (extra) {
  return Object.assign({ type: 'redis', host: REDIS_HOST, port: REDIS_PORT }, extra)
}

function foo_service (seneca) {
  return seneca
    .use(foo_plugin)
    .listen(conn({ pin: { role: 'a', cmd: '*' } }))
    .listen(conn())
    .listen(conn({ pin: { role: 'b', cmd: '*' } }))
}

function foo_run (seneca, done) {
  return seneca
    .client(conn())
    .ready(function () {
      this.act('foo:1,bar:A', function (err, out) {
        if (err) return done(err)
        Assert.equal('{"dee":"1-A"}', JSON.stringify(out))

        this.act('foo:1,bar:AA', function (err, out) {
          if (err) return done(err)
          Assert.equal('{"dee":"1-AA"}', JSON.stringify(out))

          this.act('nores:1', function (err, out) {
            if (err) return done(err)
            Assert.equal(null, out)

            // fire-and-forget
            var k = '' + Math.random()
            var v = '' + Math.random()
            this.act('faf:1,k:"' + k + '",v:"' + v + '"')

            setTimeout(function () {
              try {
                Assert.equal(v, fafmap[k])
              } catch (e) {
                return done(e)
              }
              done()
            }, 222)
          })
        })
      })
    })
}

function foo_pinrun (seneca, done) {
  return seneca
    .client(conn({ pin: { role: 'a', cmd: '*' } }))
    .client(conn({ pin: { role: 'b', cmd: '*' } }))
    .ready(function () {
      this.act('role:a,cmd:1,bar:B', function (err, out) {
        if (err) return done(err)
        Assert.equal('{"out":"a1-B"}', JSON.stringify(out))

        this.act('role:b,cmd:2,bar:BB', function (err, out) {
          if (err) return done(err)
          Assert.equal('{"out":"b2-BB"}', JSON.stringify(out))
          done()
        })
      })
    })
}

function run_pair (runner, fin) {
  var service = foo_service(make_seneca())
  service.ready(function () {
    var client = runner(make_seneca(), function (err) {
      client.close(function (cerr) {
        service.close(function (serr) {
          fin(err || cerr || serr)
        })
      })
    })
  })
}

module.exports = {
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
  make_seneca: make_seneca,
  foo_service: foo_service,
  conn: conn,
  foo_test: function (fin) { run_pair(foo_run, fin) },
  foo_pintest: function (fin) { run_pair(foo_pinrun, fin) }
}
