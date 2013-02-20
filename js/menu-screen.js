this.sd = this.sd || {};
sd.screens = sd.screens || {};

sd.screens["menu-screen"] = (function () {
	function init () {

		//sd.Game.showScreen("menu-screen");

		var menuBtns = zest(".button"),
			newGameBtn = menuBtns[0],
			optionsBtn = menuBtns[1],
			aboutBtn = menuBtns[2];

		//dodawanie zdarzeń
		newGameBtn.addEventListener("click", function (e) {
			sd.Game.showScreen("configuration-screen");
		});
	};

	return {
		init: init
	};
})();