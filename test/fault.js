/* Copyright (c) 2014-2026 Richard Rodger */
'use strict'

// Manual fault test (not part of npm test): sends a message every
// 1000/speed ms while the listening service is closed and restarted.
// Run with: node test/fault.js [speed]

var Support = require('./support')

var speed = parseInt(process.argv[2] || '2', 10)
var service = Support.foo_service(Support.make_seneca())

service.ready(function () {
  var client = Support.make_seneca().client(Support.conn())
  var i = 0

  setInterval(function () {
    console.log('CALL ' + i)
    client.act('foo:1,bar:' + i, console.log)
    i++
  }, 1000 / speed)

  setTimeout(function () {
    console.log('CLOSE SERVER')
    service.close(console.log)
  }, 5000 / speed)

  setTimeout(function () {
    console.log('RESTART SERVER')
    service = Support.foo_service(Support.make_seneca())
  }, 9000 / speed)
})
