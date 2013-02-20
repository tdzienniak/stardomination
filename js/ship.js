//namespace
this.sd = this.sd || {};

(function () {
	function Ship (x, y, radius, velocity, mass) {
		this.initialize(x, y, radius, velocity, mass);
	}

    var p = Ship.prototype = new createjs.Container();

    // original Shape's constructor:
    p.Container_initialize = p.initialize;

    p.initialize = function (x, y, radius, velocity, mass) {
    	//original Shape's constructor
    	this.Container_initialize();

    	this.x = x;//this.regX = x;
    	this.y = y;//this.regY = y;
    	this.radius = radius;
    	this.mass = mass;

        //moduły
        this.front = new sd.Module(-20, 0, 20, "white", 1, "Dziób");
        this.rear = new sd.Module(10, 0, 10, "blue", 1, "Rufa");
        this.rightWing = new sd.Module(0, -20, 15, "red", 1, "Prawe skrzydło");
        this.leftWing = new sd.Module(0, 20, 15, "green", 1, "Lewe skrzydło");
        this.hull = new sd.Module(0, 0, 10, "black", 1, "Kadłub");

        this.modules = [
            this.front,
            this.rear,
            this.rightWing,
            this.leftWing,
            this.hull
        ];

        this.modules.forEach(function (module, index, array) {
            this.addChild(module);
        }, this);

        /*
    	this.body = new createjs.Bitmap("img/ship.png");
    	this.body.rotation = -90;
    	this.body.x = -25;
    	this.body.y = 35;

    	var g = new createjs.Graphics();
        g.beginLinearGradientStroke(["yellow", "rgba(50, 50, 50, 0)"], [0, 0.2], 0, 10, 100, 100).setStrokeStyle(10).moveTo(0, 0).lineTo(70, 0).endStroke();

        this.engine = new createjs.Shape(g);
        this.engine.visible = false;

    	this.addChild(this.engine, this.body);
        */
    	this.rotation = 0;
    	this.targetAngle = 0;
    	this.degPerSecond = 135;
        this.acceleration = 6;
        this.maxVelocity = 150;

    	if (velocity instanceof sd.Vector) {
    		this.velocity = velocity;
    	} else {
    		this.velocity = new sd.Vector(velocity);	
    	}
    }

    p.move = function (delta, stage) {
        var stage = stage;

        this.prevX = this.x;
        this.prevY = this.y;

        this.modules.forEach(function (module, index, array) {
            var modulePrev = this.localToLocal(module.x, module.y, stage);
            module.prevX = modulePrev.x;
            module.prevY = modulePrev.y;
        }, this);
    	this.x += delta / 1000 * this.velocity.x;
    	this.y += delta / 1000 * this.velocity.y;
    };

    p.accelerate = function (angle) {
        if (this.velocity.length > this.maxVelocity) {
            this.velocity.length = this.maxVelocity;
            this.velocity.updateCartCoords();
        } else {
            this.velocity.substract(new sd.Vector({
                length: this.acceleration,
                angle: angle
            }));
        } 
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

    p.tick = function (event) {
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
    };

    p.onCollision = function (object, params) {
        var params = params || {};
        var collisions = [];

        if (object instanceof sd.Ball) {
            this.modules.forEach(function (module, index, modules) {
                var moduleGlobalCoords = this.localToLocal(module.x, module.y, params.stage); //{x: this.x + module.x, y: this.y + module.y};
                var distance = sd.Collisions.distanceBetweenPoints([object.x, object.y], [moduleGlobalCoords.x, moduleGlobalCoords.y]);

                if (distance <= object.radius + module.radius) {
                    collisions.push([{
                        x: moduleGlobalCoords.x,
                        y: moduleGlobalCoords.y,
                        radius: module.radius,
                        prevX: module.prevX,
                        prevY: module.prevY,
                        mass: this.mass,
                        velocity: this.velocity
                    }, object]);
                    
                    module.onHit(object);
                    if (module.hp <= 0) {
                        delete modules[index];
                        this.removeChildAt(this.getChildIndex(module));
                        return;
                    }
                }
            }, this);

            collisions.forEach(function (object, index, collisions) {
                    var intersection = sd.Collisions.intersectObjObj(object[0], object[1]);

                    this.updatePosition(this.previousPosition());
                    object[1].updatePosition(object[1].previousPosition());
                    this.moveWithVector(intersection[0]);
                    object[1].moveWithVector(intersection[1]);

                    var newVelocities = sd.Collisions.bounceObj(object[0], object[1]);

                    this.velocity = newVelocities[0];
                    object[1].velocity = newVelocities[1];

                    delete collisions[index];
            }, this);
        } else if (object instanceof sd.Edge) {
            var Ci = sd.Collisions.intersectEdgeObj(object, this);

            this.updatePosition([Ci.x, Ci.y]);

            var newVelocity = sd.Collisions.bounceFromEdge(object, this);

            this.velocity = newVelocity;
            /*
             this.modules.forEach(function (module, index, modules) {
                var moduleGlobalCoords = this.localToLocal(module.x, module.y, params.stage); //{x: this.x + module.x, y: this.y + module.y};
                var distance = sd.Collisions.distanceToEdge([moduleGlobalCoords.x, moduleGlobalCoords.y], object);

                if (distance <= module.radius) {
                    collisions.push([{
                        x: moduleGlobalCoords.x,
                        y: moduleGlobalCoords.y,
                        radius: module.radius,
                        prevX: module.prevX,
                        prevY: module.prevY,
                        velocity: this.velocity
                    }, object]);
                }
            }, this);

            collisions.forEach(function (object, index, collisions) {
                    var Ci = sd.Collisions.intersectEdgeObj(object[1], object[0]);

                    this.updatePosition([Ci.x, Ci.y]);

                    var newVelocity = sd.Collisions.bounceFromEdge(object[1], object[0]);

                    this.velocity = newVelocity;

                    delete collisions[index];
            }, this);*/
        } else if (object instanceof sd.Ship) {

        } else {
            return;
        }
    };

    sd.Ship = Ship;
})();