var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  return;
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
  return;
};

app.fetch = function() {
  $.get(app.server, function(data) {
    for (var i = 0; i < data.results.length; i++){
      app.addMessage(data.results[i]);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var newMessage = $('<div class="chat"></div>').appendTo('#chats');
  var username = $('<div class="username">'+ message.username +'</div>').appendTo(newMessage);
  var messageBody = $('<div class="messageBody">' + message.text +'</div>').appendTo(newMessage);
};

app.addRoom = function(roomName) {
  var newRoom = document.createElement('div');
  $('#roomSelect').append(newRoom);
};

$(document).ready(function() {
  $('.fetch').click(app.fetch);
  $('.clear').click(app.clearMessages);
});


// var message = {
//           username: 'Mel Brooks',
//           text: 'It\'s good to be the king',
//           roomname: 'lobby'
//         };