var util = require('./util')

var ServerComm = require('./servercomm')
var carriertypes = [
    require('./socketcomm')
]

module.exports = Comm


// Local event handling functions
var debug = util.debug
var emit = util.emit
var send = util.send


// Comm definition
function Comm(socket, opts) {
    if (!(this instanceof Comm))
        return new Comm(uri, opts)

    var self = this
    var clients = this.clients = {}
    var handles = this.handles = {}
    this._comms = []
    this.socket = socket

    var carriers = this.carriers = carriertypes.filter(function(c) {
        return c.supported
    })

    var info = this.info = {
    }
  
 
    socket.onopen = 
    handles.open = function() {
        send.call(socket, 'connect', info)

        var comm = new ServerComm(socket)
        self.server = comm

        for (var k in comm.handles)
            handles[k+':'+comm.id] = comm.handles[k]

        comm.handles.open(emit.bind(self, 'server'))
    }

    socket.onmessage = 
    handles.message = function(data) {
        debug('recv %s', data)
        var args = JSON.parse(data)
        var handler = handles[args.shift()]

        handler.apply(null, args)
    }

    handles.connect = function(id, info) {
        var comm = self._connect(id, info)
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


// Helper function for connecting
Comm.prototype._connect = function(id, info) {
    var carriers = this.carriers
    var comms = this._comms

    for (var i = 0; i < carriers.length; i++) {
        try {
            var comm = new carriers[i](this.socket, id, info)
            if (!comms[i]) comms[i] = []
            comms[i].push(id)
            return comm
        } catch (error) {}
    }

    throw new Error('Could not connect to ' + id)
}


// Public functions for transmitting data between all peers
Comm.prototype.emit = function() {
    var args = Array.prototype.slice.call(arguments)
    var carriers = this.carriers
    var comms = this._comms

    for (var i = 0; i < carriers.length; i++) {
        if (comms[i])
            carriers[i].emit.call(this, comms[i], args)
    }
}
