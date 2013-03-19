/**
 * Star Domination - a space-shooter browser game.
 *
 * @author Tymoteusz Dzienniak
 */

//namespace
this.sd = this.sd || {};

sd.Game = (function () {
	function showScreen (screenName) {
        var activeScreen = zest('.active')[0],
            toActivateScreen = zest('.' + screenName)[0];

        if (activeScreen) {
            activeScreen.removeClass('active');
        }
            
        var args = Array.prototype.slice.call(arguments, 1);

        sd.screens[screenName].init.apply(
            sd.screens[screenName], args
        );

        toActivateScreen.addClass('active');
    }

    return {
        showScreen: showScreen
    };
})();