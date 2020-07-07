const zmq = require("zeromq")

const socket = zmq.socket("sub");

socket.connect("tcp://127.0.0.1:3000");
socket.subscribe("")

socket.on("message", buf => {
  let sum = 0

  for (let i = 0; i < buf.length; i++) {
    sum += buf[i]
  }

  console.log(sum)
})
