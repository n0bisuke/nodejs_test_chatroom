// room.js


(function () {
  var socket;

  // ページロード時の処理
  $(document).ready(function () {
    // ユーザー名、ルーム名、パスワードを送信
    socket = io.connect('http://localhost');
    // ページロード時の処理ここまで
    socket.on('connected', function(data) {
      socket.emit('regist request', {roomId: minichat.roomId});
    });
    socket.on('push message', function (data) {
      alert(data.message);
    });
    socket.on('say accept', function (data) {
      $('#message').val('');
    });
  });

  $('#post-message').live('click', function () {
    socket.emit('say', {
      name: minichat.userName,
      message: $('#message').val(),
      roomId: minichat.roomId
    });
  });



}).apply(this);

