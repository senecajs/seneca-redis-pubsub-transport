'use strict'

const sinon = require('sinon')
const assert = require('assert')

const Seneca = require('seneca')
const SenecaRedisTransport = require('../lib')

describe('redis-transport', () => {
  let publisher = null
  let subscriber1 = null
  let subscriber2 = null
  const client_stub = sinon.stub()

  beforeEach(done => {
    client_stub.callsArg(1)
    publisher = Seneca({ log: 'silent' })
    publisher.use(SenecaRedisTransport)

    subscriber1 = Seneca({ log: 'silent' })
    subscriber1.use(SenecaRedisTransport, { port: 6379 })

    subscriber2 = Seneca({ log: 'silent' })
    subscriber2.use(SenecaRedisTransport, { port: 6379 })

    publisher.ready(() => subscriber1.ready(() => subscriber2.ready(done)))
  })

  afterEach(done => {
    client_stub.reset()
    publisher.close(() => subscriber1.close(() => subscriber2.close(done)))
  })

  describe('pubsub test', () => {
    beforeEach(done => {
      publisher.client({ type: 'redis', port: 6379, pin: ['cmd:test'] })
      subscriber1.listen({ type: 'redis', port: 6379, pin: ['cmd:test'] })
      subscriber2.listen({ type: 'redis', port: 6379, pin: ['cmd:test'] })
      subscriber1.add('cmd:test', client_stub)
      subscriber2.add('cmd:test', client_stub)
      publisher.ready(() => subscriber1.ready(() => subscriber2.ready(done)))
    })

    it('works properly', done => {
      publisher.act('cmd:test')

      // need to wait for redis to come back for this assertion to be true
      setTimeout(() => {
        assert.equal(client_stub.callCount, 2)
        done()
      }, 100)
    })
  })

  describe('multiple pins', () => {
    beforeEach(done => {
      publisher.client({
        type: 'redis',
        port: 6379,
        pin: ['cmd:foo', 'cmd:bar', 'cmd:baz']
      })
      subscriber1.listen({ type: 'redis', port: 6379, pin: ['cmd:foo'] })
      subscriber2.listen({
        type: 'redis',
        port: 6379,
        pin: ['cmd:bar', 'cmd:baz']
      })
      subscriber1.add('cmd:foo', client_stub)
      subscriber2.add('cmd:bar', client_stub)
      subscriber2.add('cmd:baz', client_stub)
      publisher.ready(() => subscriber1.ready(() => subscriber2.ready(done)))
    })

    it('works properly', done => {
      publisher.act('cmd:foo')
      publisher.act('cmd:bar')
      publisher.act('cmd:baz')

      // need to wait for redis to come back for this assertion to be true
      setTimeout(() => {
        assert.equal(client_stub.callCount, 3)
        done()
      }, 100)
    })
  })
})
