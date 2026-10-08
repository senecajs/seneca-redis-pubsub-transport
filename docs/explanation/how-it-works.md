# How the transport works

## Channels

The plugin maps Seneca messages onto Redis pub/sub channels. For each
topic there is a request channel `<topic>_act` and a response channel
`<topic>_res`. Topics are computed by seneca-transport:

* No pin: `seneca_any`.
* With a pin: `seneca_` plus the pin's keys in sorted order, with every
  run of non word characters replaced by `_`. For example the pin
  `role:math,cmd:*` on a service with `role:math,cmd:sum` gives
  `seneca_cmd_sum_role_math_`. A listener subscribes once per concrete
  pattern that matches its pin.

Run [docs/examples/pins.js](../examples/pins.js) to see the channel list.

## Broadcast delivery

Redis pub/sub delivers every published message to every subscriber.
If two services listen on the same topic, both run the action and both
publish a reply; the client uses the first reply and ignores the others.
Messages published while no listener is subscribed are lost, because
Redis pub/sub does not store messages. Use a queue transport when each
message must be handled exactly once.

## Lifecycle

Each `listen()` opens two Redis connections (one subscribed, one for
publishing); each client topic opens two more. Redis requires a separate
connection for subscribing, because a subscribed connection cannot
publish. The connections stay open until the Seneca instance closes.
The plugin registers a close action that quits them, and Node exits only
after they are quit.

## Seneca 3 versus Seneca 4

* Seneca 4 has no network transport in its core, so `seneca-transport`
  must be loaded before this plugin. It provides the `transport/utils`
  export that this plugin uses for message encoding, pins and reply
  matching.
* Seneca 4 closes through `sys:seneca,cmd:close`. In 4.0.0-rc5 actions on
  the Seneca 3 pattern `role:seneca,cmd:close` are not called, so the
  plugin chooses the pattern by `seneca.version`. Without this, the Redis
  connections stay open and the process does not exit.
* The top level `transport` instance option is still merged into the
  plugin options on both versions.

## Limits

* The plugin uses the callback API of the `redis` driver version 2.
* The connection error handler is attached only after the first `ready`
  event; an error before that is not handled by the plugin.
* A `topic` setting is ignored.
