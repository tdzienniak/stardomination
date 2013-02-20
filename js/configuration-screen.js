this.sd = this.sd || {};
sd.screens = sd.screens || {};

sd.screens["configuration-screen"] = (function () {
	var tabs;

	function init () {
		tabs = document.getElementsByClassName("ui-tab");

		for (var i = 0, len = tabs.length; i < len; i += 1) {
			tabs[i].addEventListener("click", function (e) {
				//w pętli usuwane są klasy aktywności 
				for (var i = 0, len = tabs.length; i < len; i += 1) {
					tabs[i].removeClass('active-tab'); //
					tabs[i].children["0"].removeClass('active-background');
					tabs[i].children["1"].firstChild.removeClass('active-background');

				}

				this.addClass('active-tab');
				this.children["0"].addClass('active-background');
				this.children["1"].firstChild.addClass('active-background');
			}, false);
		}

		var backBtn = document.getElementById("back-to-menu");
		backBtn.addEventListener("click", function (e) {
			sd.Game.showScreen("menu-screen");
		}, false);

		var battleBtn = document.getElementById("battle");
		battleBtn.addEventListener("click", function (e) {
			sd.Game.showScreen("game-screen");
		}, false);

	}

	return {
		init: init
	};
})();