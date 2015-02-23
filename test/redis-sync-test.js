/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
'use strict';

var _ = require('lodash')
var async = require('async')
var assert = require('assert')
var cluster = require('cluster')
var seneca = require('seneca')

var NUM_TASKS = 100
var NUM_WORKERS = 5

if (cluster.isMaster) {
  var workers = {}

  var tasks = {}
  for (var idx = 0; idx < NUM_TASKS; idx++) {
    tasks[idx] = {id:idx}
  }

  // start workers with standard listeners
  var resultsall = {}
  for (var i = 0; i < NUM_WORKERS; i++) {
    var worker = cluster.fork()
    workers[worker.id] = worker
    worker.on('message', function(msg) {
      if (msg.event === 'task') {
        resultsall[msg.taskid] = resultsall[msg.taskid] || {count: 0};
        resultsall[msg.taskid].count++;
      }
    });
  }

  // start workers with handle 'once' listeners
  var resultsonce = {}
  for (var i = 0; i < NUM_WORKERS; i++) {
    var worker = cluster.fork({HANDLE:'once'})
    workers[worker.id] = worker
    worker.on('message', function(msg) {
      if (msg.event === 'task') {
        resultsonce[msg.taskid] = resultsonce[msg.taskid] || {count: 0};
        resultsonce[msg.taskid].count++;
      }
    });
  }

  var si = seneca({
    timeout: 10 * 60 * 1000
  })

  si.use('../redis-transport')

  .client({type:'redis', host: '127.0.0.1', pin:'role:once,cmd:*'})
  .client({type:'redis', host: '127.0.0.1', pin:'role:all,cmd:*'})

  async.parallel([ // wait for all workers to start + own seneca ready
    function(done) {
      async.each(_.values(workers), function(worker, done) {
        worker.on('message', function(msg) {
          if (msg.event === 'ready') {
            return done()
          }
        })
      }, done)
    },
    function(done) {
      si.ready(done)
    }
  ], function() { // then act
    _.each(tasks, function(task) {
      si.act({role:'once', cmd:'test', taskid:task.id}, function (err) {
        if (err) {
          console.error(err)
        }
      })
    })
    _.each(tasks, function(task) {
      si.act({role:'all', cmd:'test', taskid:task.id}, function (err) {
        if (err) {
          console.error(err)
        }
      })
    })
    // init shutdown
    _.each(workers, function(worker) {
      worker.send({event:'shutdown'})
    })
  })

  async.each(_.values(workers), function(worker, done) { // wait for all workers to exit
    worker.on('exit', function() {
      return done()
    })
  }, function() {
    _.each(tasks, function(task) {
      // actions handled by standard listeners should processed once for every worker
      assert(resultsall[task.id])
      assert.equal(resultsall[task.id].count, NUM_WORKERS)
      // actions handled by handle 'once' listeners should be processed once and only once
      assert(resultsonce[task.id])
      assert.equal(resultsonce[task.id].count, 1)
    })
    si.close()
  })
}
else {
  var si = seneca({
    timeout: 10 * 60 * 1000
  })

  si.use('../redis-transport')

  if ('once' === process.env['HANDLE']) {  // handle 'once' listener
    si.listen({type:'redis', host:'127.0.0.1', handle:'once', pin:'role:once,cmd:*'})

      .add({role: 'once', cmd: 'test'}, function (args, done) {
        console.log(args.taskid + '-act')
        process.send({event:'task',taskid:args.taskid})
        return done()
      })
  }
  else { // normal listener
    si.listen({type:'redis', host:'127.0.0.1', pin:'role:all,cmd:*'})

      .add({role: 'all', cmd: 'test'}, function (args, done) {
        console.log(args.taskid + '-act')
        process.send({event:'task',taskid:args.taskid})
        return done()
      })
  }

  // signal worker ready
  si.ready(function() {
    process.send({event:'ready'})
  })

  process.on('message', function(msg) {
    if (msg.event === 'shutdown') {
      // allow enough time for the worker to process all messages before exiting
      setTimeout(function () {
        si.close(function () {
          process.exit(0)
        })
      }, 5000)
    }
  })
}

