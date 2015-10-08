![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

# seneca-redis-transport
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][standard-badge]][standard-style]

## Seneca Redis Transport Plugin

This plugin provides the redis pub/sub transport channel for
micro-service messages. This lets you send broadcast messsages via [redis](http://redis.io/).

NOTE: This is broadcast transport. All subscribed micro-services
receive all messages.

ALSO READ: The [seneca-transport](http://github.com/rjrodger/seneca-transport) readme has lots of introductory material about message transports. Start there if you have not used a message transport before.


If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.


- __Version:__ 0.3.0
- __Tested on:__ Seneca 0.6.1
- __Node:__ 0.10.36

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].


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

## Contributing
The [Senecajs org][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Richard Rodger and other contributors 2015, Licensed under [MIT][].

[travis-badge]: https://travis-ci.org/rjrodger/seneca-redis-transport.png?branch=master
[travis-url]: https://travis-ci.org/rjrodger/seneca-redis-transport
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[standard-badge]: https://raw.githubusercontent.com/feross/standard/master/badge.png
[standard-style]: https://github.com/feross/standard

[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[senecajs.org]: http://senecajs.org/
[Seneca.js]: https://www.npmjs.com/package/seneca
[github issue]: https://github.com/rjrodger/seneca-redis-transport/issues
[@senecajs]: http://twitter.com/senecajs
