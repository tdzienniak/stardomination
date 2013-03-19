this.sd = this.sd || {};

(function () {
    var cooldown = 0,
        reloaded = true;

    function Weapon (properties) {//(reloadTime, energyConsumption, bulletBitmap, bulletVelocity, bulletRadius, damagePerBullet) {
        this.initialize(properties);
    }

    var p = Weapon.prototype;

    p.initialize = function (properties) {
        this.reloadTime = properties.reloadTime;
        /*this.cooldown = 0;
        this.reloaded = true;*/
        this.energyConsumption = properties.energyConsumption;
        this.bulletQuantity = properties.bulletQuantity;
        this.bulletProperties = properties.bulletProperties;
        
    };

    p.fire = function (angle, coords, shipVelocity, delta) {
        var bullets = [];

        if (reloaded) {
            reloaded = false;
            cooldown = this.reloadTime;

            this.bulletProperties.angle = angle;
            this.bulletProperties.x = coords.x;
            this.bulletProperties.y = coords.y;
            this.bulletProperties.shipVelocity = shipVelocity;

            for (var i = 0; i < this.bulletQuantity; i += 1) {
                bullets.push(new sd.Bullet(this.bulletProperties));
            }
            
            return bullets;
        }

        return false;
    };

    p.tick = function (event) {
        //console.log(event);
        var delta = event.params[0];

        if ( ! reloaded) {
            cooldown -= delta;

            if (cooldown <= 0) {
                cooldown = 0;
                reloaded = true;
            }
        }
    };

    sd.Weapon = Weapon;
})();