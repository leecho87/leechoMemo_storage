(function(window){
    'use strict'

    window.qs = function(selector){
        return document.querySelector(selector);
    }

    window.qsa = function(selector){
        return document.querySelectorAll(selector);
    }

    window.$pad = function(date){
        return date > 9 ? date : '0' + date;
    }

    window.$changeHour = function(time){
        return time < 13 ? '오전 ' + window.$pad(time) : '오후 ' + window.$pad(time%12)
    }

    window.$on = function(target, type, callback){
        target.addEventListener(type, callback);
    }

    window.$multipleEvent = function(target, type, callback){
        target.forEach(function(item){
            window.$on(item, type, callback);
        });
    }

    window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
            console.log('$delegate', targetElement)
            console.log('$delegate', potentialElements)
            console.log(Array.prototype.indexOf.call(potentialElements, targetElement))
			var matchElement = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (matchElement) {
				handler.call(targetElement, event);
			}
		}

		window.$on(target, type, dispatchEvent);
	};

})(window);