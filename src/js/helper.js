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
        return time < 13 ? '[오전] ' + window.$pad(time) : '[오후] ' + window.$pad(time%12)
    }

    window.$on = function(target, type, callback){
        target.addEventListener(type, callback);
    }

    window.$multipleEvent = function(target, type, callback){
        target.forEach(function(item){
            window.$on(item, type, callback);
        });
    }
})(window);