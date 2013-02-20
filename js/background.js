this.sd = this.sd || {};

/**
 * Obiekt przechowujący referencję do elementu tła, które porusza się w zależności od zmieniającej się prędkości statku.
 * Udostępnia metody ułatwiajęce zmianę pozycji tła.
 */

(function () {
	Background = function (image, velocityScale, initX, initY) {
		this.initialize(image, velocityScale, initX, initY);
	};

    var p = Background.prototype = new createjs.Bitmap();

    // constructor:
    p.Bitmap_initialize = p.initialize;

    p.initialize = function (image, velocityScale, initX, initY) {
    	this.Bitmap_initialize(image);
        this.x = -initX;
        this.y = -initY;
    	this.velocityScale = velocityScale;
    };

    p.move = function (velocity, delta) {
    	var velocity = velocity.scale(this.velocityScale, true); //prędkość po przeskalowaniu (wektor)
    	this.x -= delta / 1000 * velocity.x;
		this.y -= delta / 1000 * velocity.y;
    };

	sd.Background = Background;
})();