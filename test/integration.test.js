'use strict'

const sinon = require('sinon')
const assert = require('assert')

const Seneca = require('seneca')
const SenecaRedisTransport = require('../lib')

describe('redis-transport', () => {
  let publisher = null
  let subscriber1 = null
  let subscriber2 = null
  const client_stub = sinon.stub().callsArg(1)

  beforeEach(done => {
    publisher = Seneca({ log: 'silent' })
    publisher.use(SenecaRedisTransport)
    publisher.client({ type: 'redis', port: 6379, pin: ['cmd:test'] })

    subscriber1 = Seneca({ log: 'silent' })
    subscriber1.use(SenecaRedisTransport, { port: 6379 })
    subscriber1.add('cmd:test', client_stub)
    subscriber1.listen({ type: 'redis', port: 6379, pin: ['cmd:test'] })

    subscriber2 = Seneca({ log: 'silent' })
    subscriber2.use(SenecaRedisTransport, { port: 6379 })
    subscriber2.add('cmd:test', client_stub)
    subscriber2.listen({ type: 'redis', port: 6379, pin: ['cmd:test'] })

    publisher.ready(() => subscriber1.ready(() => subscriber2.ready(done)))
  })

  afterEach(done => {
    publisher.close(() => subscriber1.close(() => subscriber2.close(done)))
  })

  it('pubsub test', done => {
    publisher.act('cmd:test')

    // need to wait for redis to come back for this assertion to be true
    setTimeout(() => {
      assert.equal(client_stub.callCount, 2)
      done()
    }, 100)
  })
})
