# Route messages with pins

Goal: send different message patterns over different Redis channels.

1. On the service, add one `listen()` per pin:

   ```js
   service
     .listen({ type: 'redis', port: 16382, pin: 'role:math,cmd:*' })
     .listen({ type: 'redis', port: 16382, pin: 'role:text,cmd:*' })
   ```

2. On the client, add one `client()` per pin:

   ```js
   client
     .client({ type: 'redis', port: 16382, pin: 'role:math,cmd:*' })
     .client({ type: 'redis', port: 16382, pin: 'role:text,cmd:*' })
   ```

3. Call the actions as usual. Run the complete program
   [docs/examples/pins.js](../examples/pins.js):

   ```sh
   node docs/examples/pins.js
   ```

   Output (Seneca 4.0.0-rc5, Node 24):

   ```
   sum: { answer: 3 }
   upper: { answer: 'HI' }
   channels: [
     'seneca_cmd_sum_role_math__act',
     'seneca_cmd_sum_role_math__res',
     'seneca_cmd_upper_role_text__act',
     'seneca_cmd_upper_role_text__res'
   ]
   closed
   ```

The service subscribes to one channel per concrete pattern under the
pin. See [How the transport works](../explanation/how-it-works.md#channels).
