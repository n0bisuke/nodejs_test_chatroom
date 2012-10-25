
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

// socket.ioのソケットを管理するオブジェクト
var socketsOf = {};

// socket.ioのコネクション設定
io.sockets.on('connection', function (socket) {
  // コネクションが確立されたら'connected'メッセージを送信する
  socket.emit('connected', {});

  // クライアントは'connected'メッセージを受信したら、
  // クライアントの情報とともに'regist request'メッセージを送信する
  socket.on('regist request', function (client) {
    console.log('regist client');
    if (socketsOf[client.roomId] === undefined) {
      socketsOf[client.roomId] = {};
    }
    socketsOf[client.roomId][client.userName] = socket;
  });

  // クライアントは'say'メッセージとともにチャットメッセージを送信する
  socket.on('say', function (message) {
    console.log('receive message');
    socket.emit('say accept', {});
    message.date = _formatDate(new Date());
    if (socketsOf[message.roomId] !== undefined) {
      var sockets = socketsOf[message.roomId];
      Object.keys(sockets).forEach(function (key) {
        sockets[key].emit('push message', message);
      });
    }
  });

});

function _formatDate(date) {
  var mm = date.getMonth();
  var dd = date.getDate();
  var HH = date.getHours();
  var MM = date.getMinutes();
  if (HH < 10) {
    HH = '0' + HH;
  }
  if (MM < 10) {
    MM = '0' + MM;
  }
  return mm + '/' + dd + ' ' + HH + ':' + MM;
};

