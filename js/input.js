this.sd = this.sd || {};

sd.Input = (function () {
    var handlers = {},
        immediateHandlers = {},
        actionFlags = {};

    var keys = {
        "backspace": 8,
        "tab": 9,
        "enter": 13,
        "shift": 16,
        "ctrl": 17,
        "alt": 18,
        "pause_break": 19,
        "caps_lock ": 20,
        "escape": 27,
        "page_up": 33,
        "page_down": 34,
        "end": 35,
        "home": 36,
        "left_arrow": 37,
        "up_arrow": 38,
        "right_arrow": 39,
        "down_arrow": 40,
        "insert": 45,
        "delete": 46,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "left_window_key": 91,
        "right_window_key": 92,
        "select_key": 93,
        "numpad_0": 96,
        "numpad_1": 97,
        "numpad_2": 98,
        "numpad_3": 99,
        "numpad_4": 100,
        "numpad_5": 101,
        "numpad_6": 102,
        "numpad_7": 103,
        "numpad_8": 104,
        "numpad_9": 105,
        "multiply": 106,
        "add": 107,
        "subtract": 109,
        "decimal_point": 110,
        "divide": 111,
        "f1": 112,
        "f2": 113,
        "f3": 114,
        "f4": 115,
        "f5": 116,
        "f6": 117,
        "f7": 118,
        "f8": 119,
        "f9": 120,
        "f1": 121,
        "f11": 122,
        "f12": 123,
        "num_lock": 144,
        "scroll_lock": 145,
        "semi_colon": 186,
        "equal_sign": 187,
        "comma": 188,
        "dash": 189,
        "period": 190,
        "forward_slash": 191,
        "grave_accent": 192,
        "open_bracket": 219,
        "back_slash": 220,
        "close_braket": 221,
        "single_quote": 222
    };

    function bind (action, handlersArray, immediately) {
        var immediately = immediately || false,
            actionKey = keys[action];

        if (immediately) {
            immediateHandlers[actionKey] = handlersArray;
        } else {
            handlers[actionKey] = handlersArray;
            actionFlags[actionKey] = false;
        }
    }

    function unbind (action) {
        var actionKey = keys[action];

        if (handlers.hasOwnProperty(actionKey)) {
            delete handlers[actionKey];
        } else if (immediateHandlers.hasOwnProperty(actionKey)) {
            delete immediateHandlers[actionKey];
        }
    }

    function trigger (actionKey, immediately, _this) {
        //if immediately is set to true, handler will be executed at the moment of event happening
        //if not, handler will be executet during game loop
        var _this = _this || undefined,
            immediately = immediately || false,
            actionHandlers = ( ! immediately) ? handlers : immediateHandlers;

        if (actionHandlers.hasOwnProperty(actionKey)) {
            actionHandlers[actionKey].forEach(function (handler, actionKey, handlers) {
                handler.apply(this);
            }, _this);
        } else {
            console.log("Such handler does not exist!");
        } 
    }

    function setFlag (actionKey, value) {
        if (typeof value !== "boolean") {
            console.log("'value' param must be boolean type");
            return;
        }
        
        if (typeof actionFlags[actionKey] !== "undefined") {
            actionFlags[actionKey] = value;
        }
    }

    function dispatchEvents (_this) {
        var _this = _this || undefined;
        for (var actionKey in actionFlags) {
            if (actionFlags[actionKey]) {
                trigger(actionKey, false, _this);
                /*handlers[actionKey].forEach(function (handler, actionKey, handlers) {
                    handler.apply(_this);
                }, _this);*/
            }
        }
    }

    function isImmediateEvent (actionKey) {
        return (immediateHandlers.hasOwnProperty(actionKey)) ? true : false;
    }

    return {
        bind: bind,
        unbind: unbind,
        trigger: trigger,
        setFlag: setFlag,
        dispatchEvents: dispatchEvents,
        isImmediateEvent: isImmediateEvent
    };
})();