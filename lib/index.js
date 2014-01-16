var io = require('engine.io-client')
var util = require('util')
var Comm = require('./comm')

module.exports = cio
module.exports.io = io
module.exports.Comm = Comm

module.exports.Emitter = util.Emitter


// Entry point of comm
function cio(uri, opts) {
    var socket = io(uri, opts)

    return new Comm(socket, opts)
}
