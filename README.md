# comm.io-client #

Layer for direct browser-to-browser communication over Engine.IO and WebRTC.

This is the client-side script for [comm.io](http://github.com/geky/comm.io)

## Example Usage ##

The following example creates a simple chat program in the console.

```js
var comm = cio()

comm.on('connect', function(comm) {
    comm.on('chat', function(data) {
        console.log('>', data)
    })
})

function send(data) {
    comm.emit('chat', data)
}
```

All that is required on the server side is a hook into an http server

```js
var server = require('http').Server()
var comm = require('comm.io').attach(server)

server.listen(3000)
```
