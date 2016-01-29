function BattleShip(locX, locY, rotate) {

	this.locX = locX;
	this.locY = locY;
	this.speed = 0.01;
	this.rotate = rotate;

	this.update = function() {
		var moveX = Math.cos(rotate);
		var moveY = Math.sin(rotate);

		this.locX += this.speed * moveX;
		this.locY += this.speed * moveY;
	};

}

window.onload = function() {
	
	var battleShipImg = new Image();

	battleShipImg.onload = function() {
		var currentBattleship;
		var battleShips = [];

		var gameCanvas = document.getElementById("game-area");
		var gameContext = gameCanvas.getContext("2d");

		var pixelDensity = 2;

		gameCanvas.width = window.innerWidth * pixelDensity;
		gameCanvas.height = window.innerHeight * pixelDensity;

		window.onresize = function() {
			gameCanvas.width = window.innerWidth * pixelDensity;
			gameCanvas.height = window.innerHeight * pixelDensity;
		};

		var socket = io();
	};

	battleShipImg.src = "/assets/images/ship.png";
};