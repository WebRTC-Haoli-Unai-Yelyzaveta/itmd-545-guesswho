'use strict';

var roomSocket = io('/aaa-aaaa-aaa');
var socket = io.connect("/");

socket.on('message', function(data){
  console.log('Connected...');
  socket.emit('connected', 'hello server!');
});

roomSocket.on('message', data => {
  console.log('Message received: ' + data);

  if (data == "User successfully connected to the roomNamespace"){
    roomSocket.emit('connection established', "Yeah I'm here");
  }

});
