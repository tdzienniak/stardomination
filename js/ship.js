(function (window) {
	function Ship (x, y, radius, velocity, mass) {
		this.initialize(x, y, radius, velocity, mass);
	}

    Ship.prototype = new createjs.Container();

    // original Shape's constructor:
    Ship.prototype.Container_initialize = Ship.prototype.initialize;

    Ship.prototype.initialize = function (x, y, radius, velocity, mass) {
    	//original Shape's constructor
    	this.Container_initialize();

    	this.x = x;//this.regX = x;
    	this.y = y;//this.regY = y;
    	this.radius = radius;
    	this.mass = mass;

    	this.body = new createjs.Bitmap("img/ship.png");
    	this.body.rotation = -90;
    	this.body.x = -25;
    	this.body.y = 35;


    	var g = new createjs.Graphics();
        g.beginLinearGradientStroke(["yellow", "rgba(50, 50, 50, 0)"], [0, 0.2], 0, 10, 100, 100).setStrokeStyle(10).moveTo(0, 0).lineTo(70, 0).endStroke();

        this.engine = new createjs.Shape(g);
        this.engine.visible = false;

    	this.addChild(this.engine, this.body);

    	this.rotation = 0;
    	this.targetAngle = 0;
    	this.degPerSecond = 135;
        this.acceleration = 6;
        this.maxVelocity = 150;

    	if (velocity instanceof Vector) {
    		this.velocity = velocity;
    	} else {
    		this.velocity = new Vector(velocity);	
    	}
    }

    Ship.prototype.move = function (delta) {
        this.prevX = this.x;
        this.prevY = this.y;
    	this.x += delta / 1000 * this.velocity.x;
    	this.y += delta / 1000 * this.velocity.y;
    }

    Ship.prototype.accelerate = function (angle) {
        if (this.velocity.length > this.maxVelocity) {
            this.velocity.length = this.maxVelocity;
            this.velocity.updateCartCoords();
        } else {
            this.velocity.substract(new Vector({
                length: this.acceleration,
                angle: angle
            }));
        } 
    }

    Ship.prototype.moveWithVector = function (vector) {
        this.prevX = this.x;
        this.prevY = this.y;
    	this.x += vector.x;
    	this.y += vector.y;
    }

    Ship.prototype.previousPosition = function () {
    	return [this.prevX, this.prevY];
    }
    
    Ship.prototype.updatePosition = function (position) {
    	this.x = position[0];
    	this.y = position[1];
    }

    Ship.prototype.tick = function (event) {
    	//event.target.targetAngle = event.params[1];
        event.target.rotation = event.params[1];
        /*
    	if (event.target.targetAngle < 180) {
    		event.target.targetAngle
    	}
    	if (event.target.rotation > event.target.targetAngle) {
    		event.target.rotation -= event.params[0] / 1000 * event.target.degPerSecond;
    		if (event.target.rotation < event.target.targetAngle) {
    		event.target.rotation = event.target.targetAngle;
    		}
    	} else if (event.target.rotation < event.target.targetAngle) {
    		event.target.rotation += event.params[0] / 1000 * event.target.degPerSecond;
    		if (event.target.rotation > event.target.targetAngle) {
    		event.target.rotation = event.target.targetAngle;
    		}
    	} else {
    		return;
    	}*/
    }

    window.Ship = Ship;
})(window);