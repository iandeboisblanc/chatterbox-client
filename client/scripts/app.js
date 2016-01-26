var app = {
  username: undefined
};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {

  $(document).ready(function() {
    $('.fetch').click(app.fetch);
    $('.clear').click(app.clearMessages);
    $('.dropdown-toggle').click(function() {
      $('.dropdown-menu').toggle('fast');
    });
    if (!/(&|\?)username=/.test(window.location.search)) {
      var newSearch = window.location.search;
      if (newSearch !== '' & newSearch !== '?') {
        newSearch += '&';
      }
      app.username = escapeHtml(prompt('What you be called doe?') || 'anonymous');
      newSearch += 'username=' + app.username;
      window.location.search = newSearch;
    }
  });
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
  //currently pasting everything, regardless of what's already there
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
  var username = $('<div class="username">'+ escapeHtml(message.username) +'</div>').appendTo(newMessage);
  var messageBody = $('<div class="messageBody">' + escapeHtml(message.text) +'</div>').appendTo(newMessage);
};

app.addRoom = function(roomName) {
  var newRoom = document.createElement('div');
  $('#roomSelect').append(newRoom);
};

app.init();

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}



// var message = {
//           username: 'Mel Brooks',
//           text: 'It\'s good to be the king',
//           roomname: 'lobby'
//         };