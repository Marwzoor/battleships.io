var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var users = {};

io.on('connection', function (socket) {
	socket.emit('init', {users: users});

	socket.on('disconnect', function (data) {
		socket.broadcast.emit('disconnected', {id: this.id});
		delete users[socket.id];
	});

	socket.on('move', function (data) {
		socket.broadcast.emit('move', {data: data, player: this.id});
		users[this.id].x = data.x;
		users[this.id].y = data.y;
	});

	users[socket.id] = {
		x: 0,
		y: 0
	};

	socket.broadcast.emit('connected', {id: socket.id});
});

http.listen(8080, function() {
	console.log('Listening on *:8080');
});