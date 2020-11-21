'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const io = require('socket.io')();
const roomNamespace = io.of(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/);
const indexRouter = require('./routes/index');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


roomNamespace.on('connection', socket => {
  //roomSocket is only going to be used for diagnosis
  //Emitting and listening for events should be
  //done on the 'socket' object
  const roomSocket = socket.nsp;
  console.log('Someone connected');

  //Send diagnostic message to confirm connection
  socket.emit("message",`User successfully connected to ${roomSocket.name}`);

  //Handle calling event from one peer to the other
  socket.on('game-on', function() {
    socket.broadcast.emit('game-on');
  });

  //Handle signaling events
  socket.on('signal', function({description, candidate}) {
    console.log(`Received a signal from ${socket.id}`);
    console.log({description, candidate});
    socket.broadcast.emit('signal', {description, candidate});
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = {app, io};
