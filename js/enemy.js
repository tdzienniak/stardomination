this.sd = this.sd || {};

(function () {
    var states = {

    };

    function Enemy (x, y, radius, color, velocity, mass) {
        this.initialize(x, y, radius, color, velocity, mass);
    }

    var p = Enemy.prototype = new createjs.Shape();

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
        this.maxVelocity = 70;
        this.wanderAngle = 0;

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

    p.wander = function () {
        var CIRCLE_DISTANCE = 50,
            CIRCLE_RADIUS = 20,
            ANGLE_CHANGE = 20;
        // Calculate the circle center
        var circleCenter = this.velocity.clone();
        circleCenter.normalize();
        circleCenter.scale(CIRCLE_DISTANCE);
        //
        // Calculate the displacement force
        var displacement = new sd.Vector([0, -1]);
        displacement.scale(CIRCLE_RADIUS);
       
        this.wanderAngle += Math.random() * ANGLE_CHANGE - ANGLE_CHANGE * 0.5;

        // Randomly change the vector direction
        // by making it change its current angle
        displacement.setAngle(this.wanderAngle);
       //
       // Change wanderAngle just a bit, so it
       // won't have the same value in the
       // next game frame.
       
       //
       // Finally calculate and return the wander force
        var wanderForce = circleCenter.add(displacement, true);
        return wanderForce;
    };

    p.tick = function (event) {
        var delta = event.params[0];
        var _this = event.target;
        _this.velocity.add(_this.wander()).truncate(_this.maxVelocity);

        _this.move(delta);

    };
    /*
    p.onCollision = function (object, params) {
        var params = params || {};

        if (object instanceof sd.Ball) {
            var intersection = sd.Collisions.intersectObjObj(this, object);

            this.updatePosition(this.previousPosition());
            object.updatePosition(object.previousPosition());
            this.moveWithVector(intersection[0]);
            object.moveWithVector(intersection[1]);

            var newVelocities = sd.Collisions.bounceObj(this, object);

            this.velocity = newVelocities[0];
            object.velocity = newVelocities[1];
        } else if (object instanceof sd.Edge) {
            var Ci = sd.Collisions.intersectEdgeObj(object, this);

            this.updatePosition([Ci.x, Ci.y]);

            var newVelocity = sd.Collisions.bounceFromEdge(object, this);

            this.velocity = newVelocity;
        } else if (object instanceof sd.Ship) {
            object.onCollision(this, params);
        } else {
            return;
        }
    };*/

    sd.Enemy = Enemy;
})();