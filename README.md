# seneca-redis-transport - a [Seneca](http://senecajs.org) plugin

## Seneca Redis Transport Plugin

This plugin provides the redis pub/sub transport channel for
micro-service messages. This lets you send broadcast messsages via [redis](http://redis.io/).

NOTE: This is broadcast transport. All subscribed micro-services
receive all messages.

ALSO READ: The [seneca-transport](http://github.com/rjrodger/seneca-transport) readme has lots of introductory material about message transports. Start there if you have not used a message transport before.

[![Build Status](https://travis-ci.org/rjrodger/seneca-transport.png?branch=master)](https://travis-ci.org/rjrodger/seneca-transport)

For a gentle introduction to Seneca itself, see the
[senecajs.org](http://senecajs.org) site.

If you're using this plugin module, feel free to contact me on twitter if you
have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

Current Version: 0.3.0

Tested on: Seneca 0.6.1, Node 0.10.36


### Install

```sh
npm install seneca-redis-transport
```

You'll also need [redis](http://redis.io/).


## Quick Example

```js
require('seneca')()
  .use('redis-transport')
  .add('foo:two',function(args,done){ done(null,{bar:args.bar}) })
  .client( {type:'redis',pin:'foo:one,bar:*'} )
  .listen( {type:'redis',pin:'foo:two,bar:*'} )
```



