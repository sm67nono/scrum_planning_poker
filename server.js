const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let totalUsers = 0;
let votes={};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
   //console.log('a user connected ' + socket.id);
   totalUsers++;
   io.emit('Users', totalUsers);

   socket.on('disconnect', () => {
      totalUsers--;
      delete votes[socket.id];
      console.log('Session id ' + socket.id + " Disconnected" );
      io.emit('Users', totalUsers);
     //console.log('user disconnected');
   });

   socket.on('vote', (msg) => {
     console.log(socket.id +" Vote : "+msg);
     votes[socket.id] = msg;
     io.emit('polls',votes);
      
    });

    socket.on('reveal', (msg) => {
      io.emit('show',votes);
       
     });

     socket.on('reset', (msg) => {

      let k = Object.keys(votes);
      for (let key of k)
      {
         votes[key] = -1;
      }
      io.emit('resetall',msg);
       
     });


    
 });

server.listen(3000, () => {
  console.log('listening on *:3000');
});