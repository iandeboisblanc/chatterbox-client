var app = {};

app.init = function() {
  return;
};

app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
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

var message = {
  username: 'Benian deHung',
  text: 'Welcome to Casa deHung, ya heard??!',
  roomname: 'HR38'
};


