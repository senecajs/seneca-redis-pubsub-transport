![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] transport plugin for Redis

# seneca-redis-transport
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]
[![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][standard-badge]][standard-style]

A transport module that uses [redis] as it's engine. It may also be used as an example on how to implement a transport plugin for Seneca.

__Note:__ This is broadcast transport. All subscribed micro-services receive all messages.

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].


## Install
To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```sh
npm install seneca
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

[npm-badge]: https://img.shields.io/npm/v/seneca-redis-transport.svg
[npm-url]: https://npmjs.com/package/seneca-redis-transport
[travis-badge]: https://api.travis-ci.org/rjrodger/seneca-redis-transport.svg
[travis-url]: https://travis-ci.org/rjrodger/seneca-redis-transport
[coveralls-badge]:https://coveralls.io/repos/rjrodger/seneca-redis-transport/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/rjrodger/seneca-redis-transport?branch=master
[david-badge]: https://david-dm.org/rjrodger/seneca-redis-transport.svg
[david-url]: https://david-dm.org/rjrodger/seneca-redis-transport
[gitter-badge]: https://badges.gitter.im/senecajs/seneca.svg
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
