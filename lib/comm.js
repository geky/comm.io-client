var util = require('./util')
var carriertypes = [
    require('./socketcomm')
]

module.exports = Comm


// Local event handling functions
var emit = util.emit
var send = util.send


function connect(carriers, socket, id, info) {
    for (var i = 0; i < carriers.length; i++) {
        try {
            return new carriers[i](this.socket, id, info)
        } catch (error) {}
    }

    throw new Error('Could not connect to ' + id)
}


// Comm definition
function Comm(socket, opts) {
    if (!(this instanceof Comm))
        return new Comm(uri, opts)

    var self = this
    var clients = this.clients = {}
    var handles = this.handles = {}
    this.socket = socket

    var carriers = this.carriers = carriertypes.filter(function(c) {
        return c.supported
    })

    var info = this.info = {
    }
  
 
    socket.onopen = 
    handles.open = function() {
        send.call(socket, 'connect', info)
    }

    socket.onmessage = 
    handles.message = function(data) {
        var args = JSON.parse(data)
        var handler = handles[args.shift()]

        handler.apply(null, args)
    }

    handles.connect = function(id, info) {
        var comm = connect(carriers, socket, id, info)
        clients[id] = comm

        for (var k in comm.handles)
            handles[k+':'+id] = comm.handles[k]

        comm.handles.open(emit.bind(self, 'connect'))
    }

    handles.disconnect = function(id) {
        var comm = clients[id]
        delete clients[id]

        for (var k in comm.handles)
            delete handles[k+':'+id]

        comm.handles.close(emit.bind(comm, 'disconnect'))
    }

    socket.onclose = emit.bind(self, 'disconnect')
    socket.onerror = emit.bind(self, 'error')
}


// Extend Emitter
Comm.prototype = Object.create(util.Emitter.prototype)


// Public functions for transmitting data between all peers
Comm.prototype.emit = function() {
    var args = Array.prototype.slice.call(arguments)
    var carriers = this.carriers
    var clients = this.clients

    for (var c = 0; c < carriers.length; c++) {
        var carrier = carriers[c]
        var ids = Object.keys(clients).filter(function(id) {
            return clients[id] instanceof carrier
        })

        if (ids.length) carrier.emit.call(this, ids, args)
    }
}

Comm.prototype.vemit = function() {
    var args = Array.prototype.slice.call(arguments)
    var carriers = this.carriers
    var clients = this.clients

    for (var c = 0; c < carriers.length; c++) {
        var carrier = carriers[c]
        var ids = Object.keys(clients).filter(function(id) {
            return clients[id] instanceof carrier
        })

        if (ids) carrier.vemit.call(this, ids, args)
    }
}
