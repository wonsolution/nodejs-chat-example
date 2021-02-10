const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

console.log(process.env.PORT)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.emit('chat message','welcome')

  socket.broadcast.emit('chat message','broadcast welcome')

  socket.on('chat message', msg => {
    console.log('chat message',msg)
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect',() => {
    io.emit('chat message','A user has left the chat')
  })

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


