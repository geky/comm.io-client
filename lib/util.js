var eio = require('engine.io-client')
var Emitter = eio.Emitter


// Local event handling functions
module.exports.on = Emitter.prototype.on
module.exports.off = Emitter.prototype.off
module.exports.emit = Emitter.prototype.emit
module.exports.send = function() {
    this.send(JSON.stringify(Array.prototype.slice.call(arguments)))
}

// EventEmitter class
module.exports.Emitter = Emitter
