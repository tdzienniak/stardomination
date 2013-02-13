//namespace
this.sd = this.sd || {};

(function () {
	var Edge = function (from, to, color) {
		this.initialize(from, to, color);
	};

    var p = Edge.prototype = new createjs.Shape();

    // constructor:
    p.Shape_initialize = p.initialize;

    p.initialize = function (from, to, color) {
    	//original Shape's constructor
    	this.Shape_initialize();

    	this.graphics.beginStroke(color).moveTo(from[0], from[1]).lineTo(to[0], to[1]).endStroke();

    	this.fromX = from[0];
    	this.fromY = from[1];
    	this.toX = to[0];
    	this.toY = to[1];

        this.normal = new sd.Vector([this.toX - this.fromX, this.toY - this.fromY]).rotate(90).normalize();
    };

    sd.Edge = Edge;
})();