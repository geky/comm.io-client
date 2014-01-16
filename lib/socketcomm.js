var util = require('./util')

module.exports = SocketComm
module.exports.emit = SocketComm.emit
module.exports.vemit = SocketComm.vemit

module.exports.supported = true


// Local event handling functions
var emit = util.emit
var send = util.send


// SocketComm definition
function SocketComm(socket, id, info) {
    if (!(this instanceof SocketComm))
        return new SocketComm(socket, id, info)

    if (!info.fallback)
        throw new Error('Not supported')

    var self = this
    this.socket = socket
    var handles = this.handles = {}
    this.id = id
    this.info = info

    handles.open = function(cb) {
        cb(self)
    }

    handles.data = function(args) {
        emit.apply(self, args)
    }

    handles.close = function(cb) {
        cb()
    }
}


// Extend Emitter
SocketComm.prototype = Object.create(util.Emitter.prototype)


// Public functions for transmitting data between single peer
SocketComm.prototype.emit = function() {
    send.call(this.socket, 'data', 0, [this.id],
        Array.prototype.slice.call(arguments))
}

SocketComm.prototype.vemit = function() {
    send.call(this.socket, 'data', 1, [this.id],
        Array.prototype.slice.call(arguments))
}


// Public functions for transmitting data between all peers
SocketComm.emit = function(ids, args) {
    send.call(this.socket, 'data', 0, ids, args)
}

SocketComm.vemit = function(ids, args) {
    send.call(this.socket, 'data', 1, ids, args)
}
