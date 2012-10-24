
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socketIO = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/room', routes.room);
app.get('/echo/:name', routes.echo);

var server = http.createServer(app);
var io = socketIO.listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var socketsOf = {};

io.sockets.on('connection', function (socket) {
  socket.emit('connected', {});
  socket.on('regist request', function (data) {
    console.log('regist client for ' + data.roomId);
    if (socketsOf[data.roomId] !== undefined) {
      socketsOf[data.roomId].push(socket);
    } else {
      socketsOf[data.roomId] = [socket];
    }
  });

  socket.on('say', function (data) {
    console.log('receive message');
    socket.emit('say accept', {});
    if (socketsOf[data.roomId] !== undefined) {
      var targets = socketsOf[data.roomId];
      for (var i = 0; i < targets.length; i++) {
        targets[i].emit('push message', data);
      }
    }
  });

});

