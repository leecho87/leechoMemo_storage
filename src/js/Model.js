(function(exports){
    'use strict';

    function Model(name){
        this.dbName = name;
        if(!localStorage.getItem(name)){
            var memo = [];
            localStorage.setItem(name, JSON.stringify(memo));
        }
    }

    Model.prototype.timeLog = function(getter){
        var create = {
            date :
                (function(date){
                    return [
                        date.getFullYear(),
                        $pad(date.getMonth()+1),
                        $pad(date.getDate())
                    ].join('/');
                })(new Date())
            ,
            time :
                (function(date){
                    return [
                        date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()
                    ].join(':');
                })(new Date())
        }
        return create[getter];
    }

    Model.prototype.create = function(parameter, callback){
        var self = this;
        var data = JSON.parse(localStorage.getItem(this.dbName));

        parameter = {
            ...parameter,
            timelog : `${self.timeLog('date')} / ${self.timeLog('time')}`,
            favorite : false
        }

        data.push(parameter);
        localStorage.setItem(this.dbName, JSON.stringify(data));
        callback(data);
    }
    exports.app = exports.app || {};
    exports.app.Model = Model;
})(window);