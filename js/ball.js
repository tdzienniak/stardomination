//namespace
this.sd = this.sd || {};

(function () {
	function Ball (x, y, radius, color, velocity, mass) {
		this.initialize(x, y, radius, color, velocity, mass);
	}

    var p = Ball.prototype = new createjs.Shape();

    // original Shape's constructor:
    p.Shape_initialize = p.initialize;

    p.initialize = function (x, y, radius, color, velocity, mass) {
    	//original Shape's constructor
    	this.Shape_initialize();

    	this.graphics.beginFill(color).drawCircle(x, y, radius);

    	this.regX = this.x = x;
    	this.regY = this.y = y;
    	this.radius = radius;
    	this.mass = mass;

    	if (velocity instanceof sd.Vector) {
    		this.velocity = velocity;
    	} else {
    		this.velocity = new sd.Vector(velocity);	
    	}
    };

    p.move = function (delta) {
        this.prevX = this.x;
        this.prevY = this.y;
    	this.x += delta / 1000 * this.velocity.x;
    	this.y += delta / 1000 * this.velocity.y;
    };

    p.moveWithVector = function (vector) {
        this.prevX = this.x;
        this.prevY = this.y;
    	this.x += vector.x;
    	this.y += vector.y;
    };

    p.previousPosition = function () {
    	return [this.prevX, this.prevY];
    };
    
    p.updatePosition = function (position) {
    	this.x = position[0];
    	this.y = position[1];
    };

    sd.Ball = Ball;
})();