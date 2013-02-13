//namespace
this.sd = this.sd || {};

(function () {
	function Module (x, y, radius, color, mass) {
		this.initialize(x, y, radius, color, mass);
	}

    var p = Module.prototype = new createjs.Shape();

    // original Shape's constructor:
    p.Shape_initialize = p.initialize;

    p.initialize = function (x, y, radius, color, mass) {
    	this.Shape_initialize();

    	this.graphics.beginFill(color).drawCircle(x, y, radius);

        //właściowości modułu
        this.mass = mass; //masa
        this.hp = 100; //punkty wytrzymałości
        //this.velocity = parent.velocity; //prędkość całego statku, wykorzystywana przy obliczniu kolizji
    }

    sd.Module = Module;
})();