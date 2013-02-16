this.sd = this.sd || {};

/**
 * Obiekt przechowujący referencję do elementu tła, które porusza się w zależności od zmieniającej się prędkości statku.
 * Udostępnia metody ułatwiajęce zmianę pozycji tła.
 */

(function () {
	function Background (elementID, velocityScale) {
		this.background = document.getElementById(elementID);
		this.name = elementID;
		this.velocityScale = velocityScale;
		this.positionX = 0;
		this.positionY = 0;
	}

	Background.prototype = {
		move: function (velocity, delta) {
			var velocity = velocity.scale(this.velocityScale, true); //prędkość po przeskalowaniu (wektor)
				
			this.positionX -= delta / 1000 * velocity.x;
			this.positionY -= delta / 1000 * velocity.y;

			this.background.style.backgroundPosition = this.positionX + "px " + this.positionY + "px";
		}
	};

	sd.Background = Background;
})();