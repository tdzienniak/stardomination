(function (window) {
	function Edge (from, to, color) {
		this.initialize(from, to, color);
	}

    Edge.prototype = new createjs.Shape();

    // constructor:
    Edge.prototype.Shape_initialize = Edge.prototype.initialize;

    Edge.prototype.initialize = function (from, to, color) {
    	//original Shape's constructor
    	this.Shape_initialize();

    	this.graphics.beginStroke(color).moveTo(from[0], from[1]).lineTo(to[0], to[1]).endStroke();

    	this.fromX = from[0];
    	this.fromY = from[1];
    	this.toX = to[0];
    	this.toY = to[1];

        this.normal = new Vector([this.toX - this.fromX, this.toY - this.fromY]).rotate(90).normalize();
    }

    window.Edge = Edge;
})(window);