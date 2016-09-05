'use strict'

let seneca = require('seneca')()
seneca.use('../../../lib').ready(function () {
  this.add({foo: 'one'}, function (args, done) {
    console.log('called')
    done(null, {bar: args.bar})
  })
})

seneca.listen({type: 'redis', topic: 'my-topic'})
