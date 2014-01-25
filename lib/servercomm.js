var util = require('./util')

module.exports = ServerComm
module.exports.emit = ServerComm.emit

module.exports.supported = true


// Local event handling functions
var emit = util.emit
var send = util.send


// SocketComm definition
function ServerComm(socket) {
    if (!(this instanceof ServerComm))
        return new ServerComm(socket)

    var self = this
    this.socket = socket
    var handles = this.handles = {}

    this.id = 'server'

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
ServerComm.prototype = Object.create(util.Emitter.prototype)


// Public functions for transmitting data between single peer
ServerComm.prototype.emit = function() {
    send.call(this.socket, 'data:server',
        Array.prototype.slice.call(arguments))
}
