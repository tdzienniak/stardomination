this.sd = this.sd || {};

(function () {
    //var currentLifetime = 0;

    function Bullet (properties) {
        this.initialize(properties);
    }

    var p = Bullet.prototype = new createjs.Shape();

    p.Shape_initialize = p.initialize;

    p.initialize = function (properties) {
        this.Shape_initialize();

        this.radius = properties.radius;
        this.x = this.regX = properties.x;
        this.y = this.regY = properties.y;

        this.maxLifetime = properties.lifetime;
        this.currentLifetime = 0;

        this.graphics.beginFill("white").drawCircle(this.x, this.y, this.radius);

        this.velocity = new sd.Vector({length: properties.velocity, angle: properties.angle});
        this.velocity.reverseBoth().add(properties.shipVelocity);
    };

    p.move = function (delta) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += delta / 1000 * this.velocity.x;
        this.y += delta / 1000 * this.velocity.y;
    };

    p.canLive = function (delta) {
        this.currentLifetime += delta;

        if (this.currentLifetime > this.maxLifetime) {
            return false;
        }

        return true;
    }

    sd.Bullet = Bullet;
})();