//namespace
this.sd = this.sd || {};

(function () {
	function Module (x, y, radius, color, mass, name) {
		this.initialize(x, y, radius, color, mass, name);
	}

    var p = Module.prototype = new createjs.Shape();

    // original Shape's constructor:
    p.Shape_initialize = p.initialize;

    p.initialize = function (x, y, radius, color, mass, name) {
    	this.Shape_initialize();

    	this.graphics.beginFill(color).drawCircle(x, y, radius);

        //właściowości modułu
        this.regX = this.x = x;
        this.regY = this.y = y;
        this.prevX = 0;
        this.prevY = 0;
        this.radius = radius;
        this.ownMass = mass; //masa modułu
        this.mass = 0; //masa całego statku, wykorzy
        this.hp = 100; //punkty wytrzymałości
        this.name = name; //prędkość całego statku, wykorzystywana przy obliczniu kolizji
    }

    p.onHit = function (object) {
        console.log(this.name + ' został uderzony! -20HP');
        this.hp -= 20;
    };

    sd.Module = Module;
})();