var eio = require('engine.io-client')
var debug = require('debug')('comm')
var Emitter = eio.Emitter


// Local event handling functions
module.exports.on = Emitter.prototype.on
module.exports.off = Emitter.prototype.off
module.exports.emit = Emitter.prototype.emit
module.exports.send = function() {
    var data = JSON.stringify(Array.prototype.slice.call(arguments))

    debug('send %s', data)
    this.send(data)
}

// EventEmitter class
module.exports.Emitter = Emitter
