this.sd = this.sd || {};
sd.screens = sd.screens || {};

sd.screens["configuration-screen"] = (function () {
    function init () {
        var tabs = zest(".ui-tab");

        for (var i = 0, len = tabs.length; i < len; i += 1) {
            tabs[i].addEventListener("click", function (e) {
                var activeTab = zest(".active-tab")[0];

                if (activeTab) {
                    activeTab.removeClass("active-tab");
                    activeTab.children["0"].removeClass('active-background');
                    activeTab.children["1"].firstChild.removeClass('active-background');
                }

                this.addClass('active-tab');
                this.children["0"].addClass('active-background');
                this.children["1"].firstChild.addClass('active-background');
            }, false);
        }

        

        //var backBtn = document.getElementById("back-to-menu");
        zest("#back-to-menu")[0].addEventListener("click", function (e) {
            sd.Game.showScreen("menu-screen");
        }, false);

        //var battleBtn = document.getElementById("battle");
        zest("#battle")[0].addEventListener("click", function (e) {
            sd.Game.showScreen("game-screen");
        }, false);
    }

    return {
        init: init
    };
})();