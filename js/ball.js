(function (window) {
	function Ball (x, y, radius, color, velocity, mass) {
		this.initialize(x, y, radius, color, velocity, mass);
	}

    Ball.prototype = new createjs.Shape();

    // public properties:
    /*Monster.prototype.IDLEWAITTIME = 40;
    Monster.prototype.bounds = 0; //visual radial size
    Monster.prototype.hit = 0;     //average radial disparity
*/
    // constructor:
    Ball.prototype.Shape_initialize = Ball.prototype.initialize;

    Ball.prototype.initialize = function (x, y, radius, color, velocity, mass) {
    	//original Shape's constructor
    	this.Shape_initialize();

    	this.graphics.beginFill(color).drawCircle(x, y, radius);

    	this.regX = this.x = x;
    	this.regY = this.y = y;
    	this.radius = radius;
    	this.mass = mass;

    	if (velocity instanceof Vector) {
    		this.velocity = velocity;
    	} else {
    		this.velocity = new Vector(velocity);	
    	}
    }

    Ball.prototype.move = function (delta) {
    	this.x += delta / 1000 * this.velocity.x;
    	this.y += delta / 1000 * this.velocity.y;
    }

    Ball.prototype.moveWithVector = function (vector) {
    	this.x += vector.x;
    	this.y += vector.y;
    }

    Ball.prototype.previousPosition = function (delta) {
    	return [this.x - delta / 1000 * this.velocity.x, this.y - delta / 1000 * this.velocity.y];
    }

    Ball.prototype.position = function (position) {
    	this.x = position[0];
    	this.y = position[1];
    }

    window.Ball = Ball;
})(window);