# Messages

The plugin adds Seneca transport hooks. You do not send these messages
yourself: `seneca.listen()` and `seneca.client()` send them.

## role:transport,hook:listen,type:redis

Sent by `seneca.listen({ type: 'redis', ... })`.

* Parameters: the [per-call settings](options.md#per-call-settings).
* Effect: opens two Redis connections (subscribe and publish). Subscribes
  to `<topic>_act` for every topic derived from the pins (or
  `seneca_any_act` without pins). Each incoming message is run with
  `@seneca/transport`'s `handle_request`, and the reply is published on the
  matching `<topic>_res` channel. Adds a close hook.
* Reply: none (empty reply when the listener is set up).

## role:transport,hook:client,type:redis

Sent by `seneca.client({ type: 'redis', ... })`.

* Parameters: the [per-call settings](options.md#per-call-settings).
* Effect: for each topic opens two Redis connections, subscribes to
  `<topic>_res`, and publishes outgoing messages on `<topic>_act`.
  Replies are matched to calls by `@seneca/transport`'s `handle_response`.
  Adds a close hook.
* Reply: the client send function created by `@seneca/transport`'s
  `make_client`.

## Close hook

Each listener and client adds an action that quits its Redis connections
and then calls the prior close action, on `sys:seneca,cmd:close`.

## Plugin name and exports

The plugin registers with the name `redis-transport`. Load it by its
package name, `@seneca/redis-pubsub-transport`: the short name
`redis-transport` finds the old `seneca-redis-transport` package if it
is installed. It has no exports and no decorations. It uses the
`transport/utils` export of `@seneca/transport`, which must be loaded
first; without it the plugin fails to load with a message that says
so.

## Errors

The plugin defines no error codes. Redis connection errors that happen
after the connection is ready are logged with `seneca.log.error`. Remote
action errors are returned to the caller by `@seneca/transport`.
