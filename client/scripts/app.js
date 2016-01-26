var app = {
  username: escapeHtml(window.location.search).slice(10),
  server: 'https://api.parse.com/1/classes/chatterbox',
  roomDirectory: {}, 
  currentRoom: undefined,
  mostRecentMessage: new Date('2006-01-25T20:05:21.180Z'),
  friends: {}
};

app.init = function() {
  $(document).ready(function() {
    $('.submit').click(app.handleSubmit);
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
    data: { 'order':'-createdAt'},
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
      for (var i = data.results.length - 1; i >= 0; i--) {
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
  //check against existing rooms
  var room = escapeHtml(message.roomname).trim();
  // see if it is in our room directory
  if (!app.roomDirectory[room]) {
    app.roomDirectory[room] = room;
    // append new room to DOM as an <option>
    $('.rooms').append($('<option>' + room + '</option>'));
  }
  var newMessage = $('<div class="chat"></div>');
  var username = $('<div class="username"></div>').appendTo(newMessage);
  var name = $('<a href="#" class="username">'+ escapeHtml(message.username) +'</a>').appendTo(username);
  $('.username a').click(app.addFriend);
  var messageBody = $('<div class="messageBody">' + escapeHtml(message.text) +'</div>').appendTo(newMessage);
  var fuzzyTime = moment(new Date(message.createdAt)).format("MMMM Do YYYY, h:mm:ss a");
  var timeStamp = $('<div class="timeStamp">' + fuzzyTime +'</div>').appendTo(newMessage);
  //if room = currentRoom 
  newMessage.prependTo('#chats');
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

app.addFriend = function() {
  app.friends[this.text] = this.text;
};

app.init();

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

setInterval(app.fetch, 100);

