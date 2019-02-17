![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] transport plugin for Redis

# seneca-redis-transport-fork
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Dependency Status][david-badge]][david-url]
[![Gitter][gitter-badge]][gitter-url]

[![js-standard-style][standard-badge]][standard-style]

**This has been forked from `seneca/seneca-redis-pubsub-transport` and has been modified to work with the latest seneca.**

A transport module that uses [redis] as it's engine. It may also be used as an example on how to implement a transport plugin for Seneca.

__Note:__ This is broadcast transport. All subscribed micro-services receive all messages.

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

### Seneca compatibility
Supports Seneca versions **1.x** - **3.x**

## Install
To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```sh

npm install seneca --save
npm install seneca-redis-transport-fork --save

```

In order to use this transport, you need to have a [redis][] daemon running. The deamon and instructions on how to install can be found on the redis [install page][].

## Quick Example

```js
require('seneca')()
  .use('seneca-redis-transport-fork')
  .add('foo:two', function(args, done) {done(null, {bar:args.bar})})
  // if you need this micro-service to publish & subscribe to commands add client & listen 
  .client({type:'redis'})  // add client to be able this micro-service to publish
  .listen({type:'redis'}) // add listen to be able this micro-service to subscribe
```

## Running Examples

In order to run the [examples][] we provide the required docker configuration
in `docker-compose.yml` and the folder `docker`. Just run `docker-compose up` in
the root folder and it should bring up a redis server. Please be aware that if you
are using `docker-machine` the ip running the redis server is the ip of your docker-machine.

In order to find the ip of your `docker-machine` just execute:
```
docker-machine ip <your-docker-machine-name>
```

## Example Using Redis Server Url
```js
require('seneca')({
  transport: {
    redis: {
      // you can use The URL of the Redis server. Format:-
      url: "[redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]"
    }
  }
})
.use('seneca-redis-transport-fork')
```
(More info available About Url Format at [IANAl] ).

## Running Tests

If you don't have a redis server handy, you can use docker.

```sh
npm run build
npm run start
```

With that done, you can run tests:

```sh
npm run test
```

Once you're finished:
```sh
npm run stop
```

## Contributing
The [Senecajs org][] encourages open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Richard Rodger and other contributors 2014 - 2016, Licensed under [MIT][].

[npm-badge]: https://img.shields.io/npm/v/seneca-redis-transport-fork.svg
[npm-url]: https://npmjs.com/package/seneca-redis-transport-fork
[travis-badge]: https://api.travis-ci.org/tswaters/seneca-redis-transport-fork.svg
[travis-url]: https://travis-ci.org/tswaters/seneca-redis-transport-fork
[coveralls-badge]:https://coveralls.io/repos/tswaters/seneca-redis-transport-fork/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/tswaters/seneca-redis-transport-fork?branch=master
[david-badge]: https://david-dm.org/tswaters/seneca-redis-transport-fork.svg
[david-url]: https://david-dm.org/tswaters/seneca-redis-transport-fork

[standard-badge]: https://raw.githubusercontent.com/feross/standard/master/badge.png
[standard-style]: https://github.com/feross/standard

[redis]: http://redis.io/
[install page]: http://redis.io/download
[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[senecajs.org]: http://senecajs.org/
[Seneca.js]: https://www.npmjs.com/package/seneca
[github issue]: https://github.com/tswaters/seneca-redis-transport-fork/issues
[examples]: https://github.com/tswaters/seneca-redis-transport-fork/tree/master/docs/examples
[@senecajs]: http://twitter.com/senecajs

[IANAl]: http://www.iana.org/assignments/uri-schemes/prov/redis
