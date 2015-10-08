![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] transport plugin

# seneca-redis-transport
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][standard-badge]][standard-style]

A transport module that uses [redis] as it's engine. It may also be used as an example on how to implement a transport plugin for Seneca.

__Note:__ This is broadcast transport. All subscribed micro-services receive all messages.

- __Version:__ 0.3.0
- __Tested on:__ Seneca 0.6.1
- __Node:__ 0.10.36

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].


### Install

```sh
npm install seneca-redis-transport
```

In order to use this transport, you need to have a [redis][] daemon running. The deamon and instructions on how to install can be found on the redis [install page][].

## Quick Example

```js
require('seneca')()
  .use('redis-transport')
  .add('foo:two', function(args, done) {done(null, {bar:args.bar})})
  .client({type:'redis', pin:'foo:one, bar:*'})
  .listen({type:'redis', pin:'foo:two, bar:*'})
```

## Contributing
The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Richard Rodger and other contributors 2015, Licensed under [MIT][].

[travis-badge]: https://travis-ci.org/rjrodger/seneca-redis-transport.png?branch=master
[travis-url]: https://travis-ci.org/rjrodger/seneca-redis-transport
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca
[standard-badge]: https://raw.githubusercontent.com/feross/standard/master/badge.png
[standard-style]: https://github.com/feross/standard

[redis]: http://redis.io/
[install page]: http://redis.io/download
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[senecajs.org]: http://senecajs.org/
[Seneca.js]: https://www.npmjs.com/package/seneca
[github issue]: https://github.com/rjrodger/seneca-redis-transport/issues
[@senecajs]: http://twitter.com/senecajs
