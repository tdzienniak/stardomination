this.sd = this.sd || {};
sd.screens = sd.screens || {};

sd.screens["game-screen"] = (function () {
	function init () {
		//sd.Game.showScreen("game-screen");
		sd.Game.init();
	}

	function run () {
		sd.Game.init();
	}

	return {
		init: init
	};
})();