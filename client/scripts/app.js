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

app.fetch = function() {
  // $.ajax({
  //   url: 'https://api.parse.com/1/classes/chatterbox',
  //   type: 'GET',
  //   data: JSON.stringify(message),
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Message had been got');
  //   },
  //   error: function (data) {
  //     console.error('chatterbox: Failed to nab dat message doe');
  //   }
  // });
  $.get('https:api.parse.com/1/classes/chatterbox', function(data){
    console.log(data);
  });
};

$(document).ready(function() {
  $('.fetch').click(app.fetch);
});