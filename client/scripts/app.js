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
  $.get(app.server, function(data){
    console.log(data);
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  // create DOM element
  var newMessage = document.createElement('div');
  // change text in div to message
  // append to $('#chats')
  $('#chats').append(newMessage);
};

app.addRoom = function(roomName) {
  var newRoom = document.createElement('div');
  $('#roomSelect').append(newRoom);
};



$(document).ready(function() {
  $('.fetch').click(app.fetch);
});

