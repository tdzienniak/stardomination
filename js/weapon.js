this.sd = this.sd || {};

(function () {
    function Weapon (properties);//(reloadTime, energyConsumption, bulletBitmap, bulletVelocity, bulletRadius, damagePerBullet) {
        this.initialize(properties);
    }

    var p = Weapon.prototype;

    p.initialize = function (properties) {
        this.reloadTime = properties.reloadTime;
        this.energyConsumption = properties.energyConsumption;
        this.bulletQuantity = properties.bulletQuantity;
        this.bulletProperties = {
            bitmap: properties.bulletBitmap,
            radius: properties.bulletRadius,
            velocity: properties.bulletVelocity
        };
    };

    p.fire = function () {
        var bullets = [];

        for (var i = 0; i < this.bulletQuantity; i += 1) {
            bullets.push(new sd.Bullet(this.bulletProperties));
        }
        
        return bullets;
    };

    sd.Weapon = Weapon;
})();