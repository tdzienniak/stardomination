(function (window) {
	function Vector (coords) {
		if (Object.prototype.toString.call(coords) === "[object Array]") {
			this.x = coords[0];
			this.y = coords[1];
			this.updatePolarCoords();
		} else if (typeof coords === 'object') {
			if (typeof coords.x === 'undefined') { //podano wspórzędne biegunowe
				this.angle = coords.angle;
				this.length = coords.length;

				//uzupełnianie wspórzędnych kartezjańskich
				this.updateCartCoords();
			} else { //podano wspórzędne kartezjańskie
				this.x = coords.x;
				this.y = coords.y;

				//uzupełnianie współrzędnych biegunowych
				this.updatePolarCoords();
			}
		} else {
			throw new Error('Podałeś zły format współrzędnych!');
		}
	}

	Vector.prototype.rotate = function (angle) {
		var fullAngles = angle % 360, //używana do redukcji kąta w przypadku miary ponad 360 stopni
			newAngle = (angle > 0) ? (this.angle + (angle - 360 * fullAngles)) : (this.angle + (angle + 360 * fullAngles));

		if (newAngle > 180) {
			this.angle = -360 + newAngle;
		} else if (newAngle < -180) {
			this.angle = 360 + newAngle;
		} else {
			this.angle = newAngle;
		}

		return this;
	};

	Vector.prototype.add = function (vector, returnNew) {
		var returnNew = returnNew || false;

		if (Object.prototype.toString.call(vector) === "[object Array]") {
			this.x += vector[0];
			this.y += vector[1];
			this.updatePolarCoords();
		} else if (typeof vector === 'object') {
			if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
				return new Vector([this.x + vector.x, this.y + vector.y]);
			} else {
				this.x += vector.x;
				this.y += vector.y;

				this.updatePolarCoords();
			}

			return this;
		} else {
			throw new Error('Zły parametr.')
		}
	};

	Vector.prototype.scale = function (scalar, returnNew) {
		var returnNew = returnNew || false;

		if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
			return new Vector([this.x * scalar, this.y * scalar]);
		} else {
			this.x *= scalar;
			this.y *= scalar;
			this.updatePolarCoords();
		}

		return this;
	};

	Vector.prototype.normalize = function (returnNew) {
		var returnNew = returnNew || false;

		if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
			return new Vector({
				angle: this.angle,
				length: 1
			});
		} else {
			this.length = 1;
			this.updateCartCoords();
		}

		return this;
	};

	Vector.prototype.substract = function (vector, returnNew) {
		var returnNew = returnNew || false;

		if (typeof vector === 'object') {
			if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
				return new Vector([this.x - vector.x, this.y - vector.y]);
			} else {
				this.x -= vector.x;
				this.y -= vector.y;

				this.updatePolarCoords();
			}

			return this;
		} else {
			throw new Error('Zły parametr.')
		}
	};

	Vector.prototype.dot = function (vector) {
		var scalar;

		if (Object.prototype.toString.call(vector) === "[object Array]") {
			scalar = this.x * vector[0] + this.y * vector[1];
		} else if (typeof vector === 'object') {
			scalar = this.x * vector.x + this.y * vector.y;
		} else {
			throw new Error('Zły parametr.')
		}

		return scalar;
	}

	Vector.prototype.reverseX = function (returnNew) {
		var returnNew = returnNew || false;

		if (returnNew) {
			return new Vector([-this.x, this.y]);
		} else {
			this.x = -this.x;
			this.updatePolarCoords();
		}
	}

	Vector.prototype.reverseY = function (returnNew) {
		var returnNew = returnNew || false;

		if (returnNew) {
			return new Vector([this.x, -this.y]);
		} else {
			this.y = -this.y;
			this.updatePolarCoords();
		}
	}

	Vector.prototype.angleBetween = function (vector) {

	}

	Vector.prototype.negate = function (returnNew) {

	}

	Vector.prototype.clone = function () {
		return new Vector([this.x, this.y]);
	};

	Vector.prototype.updatePolarCoords = function () {
		this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		this.angle = Math.atan2(this.y, this.x) * 180 / Math.PI;
	};

	Vector.prototype.updateCartCoords = function () {
		this.x = Math.cos(this.angle * Math.PI / 180) * this.length;
		this.y = (this.angle === 180 || this.angle === -180) ? 0 : Math.sin(this.angle * Math.PI / 180) * this.length
	};

	window.Vector = Vector;
})(window);