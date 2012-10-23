
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'minichat' });
};

exports.room = function(req, res){
  var roomName = req.body.roomName || '';
  var yourName = req.body.yourName || '';
  var password = req.body.password || '';

  var params = {
    title: 'チャットルーム：' + roomName,
    room: {
      name: roomName,
      password: password
    },
    user: {name: yourName}
  };
  res.render('room', params);
};
