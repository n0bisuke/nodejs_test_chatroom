/*
 * GET home page.
 */

var crypto = require('crypto');

exports.index = function(req, res){
  res.render('index', { title: 'minichat' });
};

exports.echo = function(req, res) {
  var roomName = req.params.name;
  var yourName = 'test';
  var password = 'minichattest';
  var hashedPassword = '';
  var shasum = crypto.createHash('sha512');

  if (password !== '') {
    shasum.update(password);
    hashedPassword = shasum.digest('hex');
  }

  var params = {
    title: 'チャットルーム：' + roomName,
    room: {
      name: roomName,
      password: hashedPassword
    },
    user: {name: yourName}
  };
  res.render('room', params);
};

exports.room = function(req, res){
  var roomName = req.body.roomName || '';
  var yourName = req.body.yourName || '';
  var password = req.body.password || '';
  var hashedPassword = '';
  var shasum = crypto.createHash('sha512');

  if (password !== '') {
    shasum.update(password);
    hashedPassword = shasum.digest('hex');
  }

  var params = {
    title: 'チャットルーム：' + roomName,
    room: {
      name: roomName,
      password: hashedPassword
    },
    user: {name: yourName}
  };
  res.render('room', params);
};
