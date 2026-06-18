![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] plugin

# @seneca/redis-pubsub-transport

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install seneca --save
npm install seneca-redis-pubsub-transport --save
```

## Quick Example

```js
require('seneca')()
  .use('seneca-redis-transport')
  .add('foo:two', function(args, done) {done(null, {bar:args.bar})})
  // if you need this micro-service to publish & subscribe to commands add client & listen 
  .client({type:'redis'})  // add client to be able this micro-service to publish
  .listen({type:'redis'}) // add listen to be able this micro-service to subscribe
```

## More Examples

See [test/](test/) for usage examples.

## Motivation

A transport module that uses [redis][] as its engine. This is a broadcast transport — all subscribed micro-services receive all messages.

## Support

If you're using this module and need help, you can:

- Post a [github issue][]
- Tweet to [@senecajs][]
- Ask on the [Gitter][gitter-url]

## API

### Example Using Redis Server URL

```js
require('seneca')({
  transport: {
    redis: {
      url: "[redis:]//[[user][:password@]][host][:port][/db-number]"
    }
  }
})
.use('seneca-redis-transport')
```

## Contributing

The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running examples with Docker

```sh
docker-compose up
```

## Background

Uses [redis](http://redis.io/) for pub-sub message distribution. See [examples](https://github.com/senecajs/seneca-redis-pubsub-transport/tree/master/docs/examples) for more.

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]
[![Gitter][gitter-badge]][gitter-url]
[![js-standard-style][standard-badge]][standard-style]
[npm-badge]: https://img.shields.io/npm/v/seneca-redis-pubsub-transport.svg
[npm-url]: https://npmjs.com/package/seneca-redis-pubsub-transport
[travis-badge]: https://api.travis-ci.org/senecajs/seneca-redis-pubsub-transport.svg
[travis-url]: https://travis-ci.org/senecajs/seneca-redis-pubsub-transport
[coveralls-badge]:https://coveralls.io/repos/senecajs/seneca-redis-pubsub-transport/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/senecajs/seneca-redis-pubsub-transport?branch=master
[david-badge]: https://david-dm.org/senecajs/seneca-redis-pubsub-transport.svg
[david-url]: https://david-dm.org/senecajs/seneca-redis-pubsub-transport
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
[github issue]: https://github.com/senecajs/seneca-redis-pubsub-transport/issues
[examples]: https://github.com/senecajs/seneca-redis-pubsub-transport/tree/master/docs/examples
[@senecajs]: http://twitter.com/senecajs
[IANAl]: http://www.iana.org/assignments/uri-schemes/prov/redis
