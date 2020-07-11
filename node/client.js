const fs = require('fs')
const zmq = require('zeromq')

const { Parser } = require('./parser')

const socket = zmq.socket('sub')

socket.connect('tcp://127.0.0.1:3000')
socket.subscribe('')

const parser = new Parser(32e3)

socket.on('message', (buffer) => {
  parser.parse(buffer)

  if (parser.bits.length) console.log(parser.bits)
})
