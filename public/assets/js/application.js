function BattleShip(locX, locY, rotate) {

	this.locX = locX;
	this.locY = locY;
	this.speed = 5;
	this.rotate = rotate * (Math.PI / 180);

	this.update = function() {
		var moveX = Math.cos(this.rotate);
		var moveY = Math.sin(this.rotate);

		this.locX += this.speed * moveX;
		this.locY += this.speed * moveY;
	};

	this.draw = function(ctx) {
		ctx.fillRect(this.locX-5, this.locY-5, 10, 10);
	};

	this.setRotation = function(rotate) {
		this.rotate = rotate * (Math.PI / 180);
	};

	this.getLocX = function() {
		return this.locX;
	};

	this.getLocY = function() {
		return this.locY;
	};

	this.setLocX = function(locX) {
		this.locX = locX;
	};

	this.setLocY = function(locY) {
		this.locY = locY;
	};

	this.getRotation = function() {
		return this.rotate;
	};
}

window.onload = function() {
	
	var battleShipImg = new Image();

	battleShipImg.onload = function() {
		var gameCanvas = document.getElementById("game-area");
		var gameContext = gameCanvas.getContext("2d");

		var pixelDensity = 2;

		gameCanvas.width = window.innerWidth * pixelDensity;
		gameCanvas.height = window.innerHeight * pixelDensity;

		window.onresize = function() {
			gameCanvas.width = window.innerWidth * pixelDensity;
			gameCanvas.height = window.innerHeight * pixelDensity;
		};

		var startX = Math.round(Math.random()*(gameCanvas.width-5)),
			startY = Math.round(Math.random()*(gameCanvas.height-5)),
			startRotation = Math.round(Math.random() * 360);

		var currentBattleship = new BattleShip(startX, startY, startRotation);

		var teamBattleShips = {};

		var socket = io();

		socket.on('init', function (data) {

			for(var i in data.users) {
				var user = data.users[i];

				teamBattleShips[i] = new BattleShip(user.x, user.y, 0);
			}

			socket.on('connected', function (data) {
				teamBattleShips[data.id] = new BattleShip(0, 0, 0);
			});

			socket.on('disconnected', function (data) {
				delete teamBattleShips[data.id];
			});

			socket.on('move', function (data) {
				var battleShip = teamBattleShips[data.player];

				battleShip.setLocX(data.data.x);
				battleShip.setLocY(data.data.y);
			});

			var update = function() {
				currentBattleship.update();
				socket.emit('move', {x: currentBattleship.getLocX(), y: currentBattleship.getLocY()});
			};

			var draw = function() {
				gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

				currentBattleship.draw(gameContext);

				for(var i in teamBattleShips) {
					teamBattleShips[i].draw(gameContext);
				}
			};

			var animate = function() {
				update();
				draw();

				window.requestAnimationFrame(animate);
			};

			animate();

			window.onmousemove = function (e) {
				e = e || window.event;

				var angle = Math.atan2(e.pageY - (currentBattleship.getLocY() / pixelDensity), e.pageX - (currentBattleship.getLocX() / pixelDensity));

				angle *= 180 / Math.PI;

				if(angle < 0)
					angle += 360;

				currentBattleship.setRotation(angle);
			};
		});
		
	};

	battleShipImg.src = "/assets/images/ship.png";

};