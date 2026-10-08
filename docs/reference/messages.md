# Messages

The plugin adds Seneca transport hooks. You do not send these messages
yourself: `seneca.listen()` and `seneca.client()` send them.

## role:transport,hook:listen,type:redis

Sent by `seneca.listen({ type: 'redis', ... })`.

* Parameters: the [per-call settings](options.md#per-call-settings).
* Effect: opens two Redis connections (subscribe and publish). Subscribes
  to `<topic>_act` for every topic derived from the pins (or
  `seneca_any_act` without pins). Each incoming message is run with
  seneca-transport's `handle_request`, and the reply is published on the
  matching `<topic>_res` channel. Adds a close hook.
* Reply: none (empty reply when the listener is set up).

## role:transport,hook:client,type:redis

Sent by `seneca.client({ type: 'redis', ... })`.

* Parameters: the [per-call settings](options.md#per-call-settings).
* Effect: for each topic opens two Redis connections, subscribes to
  `<topic>_res`, and publishes outgoing messages on `<topic>_act`.
  Replies are matched to calls by seneca-transport's `handle_response`.
  Adds a close hook.
* Reply: the client send function created by seneca-transport's
  `make_client`.

## Legacy type pubsub

`role:transport,hook:listen,type:pubsub` and
`role:transport,hook:client,type:pubsub` run the same code as the `redis`
type. The plugin options have no `pubsub` block, so only the per-call
settings apply; without `host`, `port` or `url` the Redis driver default
(`127.0.0.1:6379`) is used.

## Close hook

Each listener and client adds an action that quits its Redis connections
and then calls the prior close action:

* Seneca 4: `sys:seneca,cmd:close`.
* Seneca 3: `role:seneca,cmd:close`.

## Plugin name and exports

The plugin registers with the name `redis-transport`. It has no exports
and no decorations. It uses the `transport/utils` export of
seneca-transport, which must be loaded first.

## Errors

The plugin defines no error codes. Redis connection errors that happen
after the connection is ready are logged with `seneca.log.error`. Remote
action errors are returned to the caller by seneca-transport.
