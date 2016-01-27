var app = {
  username: escapeHtml(window.location.search).slice(10),
  server: 'https://api.parse.com/1/classes/chatterbox',
  roomDirectory: {}, 
  currentRoom: undefined,
  mostRecentMessage: new Date('2006-01-25T20:05:21.180Z'),
  friends: {},
  blocked: {},
  friendicator: false
};

app.init = function() {
  $(document).ready(function() {
    $('.submit').click(app.handleSubmit);
    $('.rooms').on('change', app.changeRoom);
    $('.friendFilter').click(app.toggleFriendFilter);
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
      app.fetch();
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
    data: { 'order':'-createdAt', 'limit': 1000},
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
  app.mostRecentMessage = new Date('2006-01-25T20:05:21.180Z');
};

app.addMessage = function(message) {
  var room = escapeHtml(message.roomname).trim();
  room = room.slice(0,30);
  if (!app.roomDirectory[room]) {
    app.roomDirectory[room] = room;
    $('.rooms').append($('<option/>').val(room).text(room));
  }
  var newMessage = $('<div class="chat"/>');
  var username = $('<div class="username"/>').appendTo(newMessage);
  var name = $('<a href="#" class="username"/>').text(escapeHtml(message.username)).appendTo(username);
  var friendButton = $('<button class="friendButton"/>').text('Friend!').appendTo(username);
  var blockButton = $('<button class="blockButton"/>').text('Block!').appendTo(username);
  $('.friendButton').click(app.addFriend);
  $('.blockButton').click(app.blockFriend);
  var messageBody = $('<div class="messageBody"/>').text(escapeHtml(message.text)).appendTo(newMessage);
  var fuzzyTime = moment(new Date(message.createdAt)).format("MMMM Do YYYY, h:mm:ss a");
  var timeStamp = $('<div class="timeStamp"/>').text(fuzzyTime).appendTo(newMessage);
  if(room === app.currentRoom) {
    if(app.friendicator) {
      //check if username in friendlist
      if (!(username.text() in app.friends)) {
        return;
      }
    }
    if(username.text() in app.blocked) {
      return;
    }
    newMessage.prependTo('#chats');
  }
};

app.handleSubmit = function() {
  var text = $('textarea').val();
  if (text.length > 0) {
    if($('.rooms').prop('selectedIndex') === 1) {
      app.currentRoom = $('#roomInput').val();
      $('#roomInput').css('display','none');
      if (!app.roomDirectory[app.currentRoom]) {
        app.roomDirectory[app.currentRoom] = app.currentRoom;
        $('.rooms').append($('<option/>').val(app.currentRoom).text(app.currentRoom));
      }
      $('.rooms').prop('selectedIndex', $('.rooms').children().length - 1);
      $('#roomInput').val('');
      app.clearMessages();
      app.fetch();
    }
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

app.blockFriend = function() {
  app.blocked[this.text] = this.text;
};

app.changeRoom = function() {
  if(this.selectedIndex === 0 || this.selectedIndex === 2) {
    app.currentRoom = undefined;
  }
  else if(this.selectedIndex === 1) {
    $('#roomInput').css('display','inline');
  }
  else {
    app.currentRoom = this[this.selectedIndex].value;
    app.clearMessages();
    app.fetch();
  }
};

app.toggleFriendFilter = function() {
  $friendicator = $('#friendicator');
  if(!app.friendicator) {
    $friendicator.text('ON');
  } else {
    $friendicator.text('OFF');
  }
  app.friendicator = !app.friendicator;
  app.clearMessages();
  app.fetch();
};

app.init();

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

setInterval(app.fetch, 1500);



var rohitBot = function() {
  var $rooms = $('.rooms');
  var username = 'Rohit';
  var text = 'Hey guys, party at my place this saturday! Bring juice!';
  for(var i = 3; i < $rooms.children().length; i++) {
    var roomname = $rooms.children()[i].value;
    var message = {
      username: username,
      text: text,
      roomname: roomname
    };
    app.send(message);
  }
};

var shaneBot = function() {
  var $rooms = $('.rooms');
  var juices = ['grape','apple','cranberry','orange','acai','banana-mango','pomegranate','Hawaiian Punch', 'tomato','tropical blend','pineapple','cranapple'];
  var username = 'Shane';
  for(var i = 3; i < $rooms.children().length; i++) {
    var juice = juices[Math.floor(Math.random()*juices.length)];
    var text = 'You bet! Dibs on ' + juice +'!';
    var roomname = $rooms.children()[i].value;
    var message = {
      username: username,
      text: text,
      roomname: roomname
    };
    app.send(message);
  }
};

var thomasBot = function() {
  var $rooms = $('.rooms');
  var username = 'Thomas';
  var textOptions = ['foob', 'boob', 'bloop', 'poop', 'shloopy', 'doopy', 'doo', 'glooboobooboo', 'gloob', 'oob', 'oopsy poopsy'];
  for(var i = 3; i < $rooms.children().length; i++) {
    var text1 = textOptions[Math.floor(Math.random()*textOptions.length)];
    var text2 = textOptions[Math.floor(Math.random()*textOptions.length)];
    var text3 = textOptions[Math.floor(Math.random()*textOptions.length)];
    var roomname = $rooms.children()[i].value;
    var message = {
      username: username,
      text: text1 + ' ' + text2 + ' ' + text3,
      roomname: roomname
    };
    app.send(message);
  }
};