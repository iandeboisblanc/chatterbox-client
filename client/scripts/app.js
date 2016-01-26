var app = {
  username: escapeHtml(window.location.search).slice(10),
  server: 'https://api.parse.com/1/classes/chatterbox',
  currentRoom: undefined,
  mostRecentMessage: new Date('2006-01-25T20:05:21.180Z')
};

app.init = function() {
  $(document).ready(function() {
    $('.submit').click(app.handleSubmit);
    $('.fetch').click(app.fetch);
    $('.clear').click(app.clearMessages);
  });
  app.fetch();
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
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { 'order':'-createdAt' },
    dataFilter:function(data) {
      data = JSON.parse(data);
      var newData = {results:[]};
      for (var i = 0; i < data.results.length; i++) {
        if(new Date(data.results[i].createdAt) > app.mostRecentMessage) {
          newData.results.push(data.results[i]);
        }
      }
      return JSON.stringify(newData);
    },
    success: function (data) {
      for (var i = 0; i < data.results.length; i++) {
        app.addMessage(data.results[i]);
      }
      if(data.results[0]) {
        app.mostRecentMessage = new Date(data.results[0].createdAt);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var newMessage = $('<div class="chat"></div>').prependTo('#chats');
  var username = $('<div class="username">'+ escapeHtml(message.username) +'</div>').appendTo(newMessage);
  var messageBody = $('<div class="messageBody">' + escapeHtml(message.text) +'</div>').appendTo(newMessage);
  var fuzzyTime = moment(new Date(message.createdAt)).format("MMMM Do YYYY, h:mm:ss a");;
  var timeStamp = $('<div class="timeStamp">' + fuzzyTime +'</div>').appendTo(newMessage);
};

app.handleSubmit = function() {
  var text = $('textarea').val();
  if (text.length > 0) {
    var message = {
      username: app.username,
      text: text,
      roomname: app.currentRoom
    };
    app.send(message);
  }
  $('textarea').val('');
};

app.addRoom = function(roomName) {
  var newRoom = document.createElement('div');
  $('#roomSelect').append(newRoom);
};

app.updateTime = function() {
  var timeStamps = $('#chats .message .timeStamp');
  for(var i = 0; i < timeStamps.length; i++) {

  }
};

app.init();

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

setInterval(app.fetch, 5000);

