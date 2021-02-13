const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

var SerialPort = require('serialport')
const PORT = '/dev/ttyS0'
const BAUDRATE = 115200

const port = process.env.PORT || 3000;

const app = express()

const server = http.createServer(app)
const io = socketIo(server)

// return by line 
var serialport = new SerialPort(PORT,{baudRate:BAUDRATE,parser: new SerialPort.parsers.Readline("\n")})

serialport.on('open', function() {
  console.log("serialport open ",serialport.isOpen);
});


serialport.on('data', function (data) {
  //console.log("receive ",data);
  var msg = data.toString('utf-8')
  //console.log('msg',msg.length)
  if ( msg.length>0 ) {
    console.log('receive',data.toString('utf-8'));
    io.emit('message', data.toString('utf-8'));
 
  }
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  //socket.emit('chat message','welcome')

  //socket.broadcast.emit('chat message','broadcast welcome')


  socket.on('message', msg => {
    console.log('message',msg)
    io.emit('message', msg);
    serialport.write(msg+'\n')
  });
  
  // socket.on('disconnect',() => {
  //   io.emit('chat message','A user has left the chat')
  // })

});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


