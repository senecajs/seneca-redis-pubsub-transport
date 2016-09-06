'use strict'

let seneca = require('seneca')()
seneca.use('../../../lib').ready(function () {
  this.act({foo: 'one', bar: 'aloha'}, function (err, response) {
    if (err) {
      return console.log(err)
    }
    console.log(response)
  })
}).client({type: 'redis', topic: 'my-topic'})
