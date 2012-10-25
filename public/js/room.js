// room.js

(function () {
  var socket;

  // ページロード時の処理
  $(document).ready(function () {
    // ユーザー名、ルーム名、パスワードを送信
    socket = io.connect('http://localhost');

    // メッセージハンドラの定義
    // サーバーへの接続完了
    socket.on('connected', function(data) {
      socket.emit('regist request', minichat);
    });

    // チャットメッセージ受信
    socket.on('push message', function (message) {
      var html = '<div class="message">'
        + '<p class="postdate pull-right">' + message.date + '</p>'
        + '<p class="author">' + message.from + '：</p>'
        + '<p class="comment">' + message.body + '</p>'
        + '</div>';
      $('#messages').prepend(html);
    });

    // チャットメッセージの送信完了
    socket.on('say accept', function (data) {
      $('#message').val('');
    });

    // メッセージの送信ボタンを有効化
    $('#post-message').on('click', function () {
      var message = {
        from: minichat.userName,
        body: $('#message').val(),
        roomId: minichat.roomId
      };
      socket.emit('say', message);
    });

  }); // document.ready()ここまで


}).apply(this);

