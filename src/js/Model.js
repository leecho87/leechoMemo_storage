(function(exports){
    'use strict';

    var tag = '[Model]';

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
                        $changeHour(date.getHours()),
                        $pad(date.getMinutes()),
                        $pad(date.getSeconds())
                    ].join(':');
                })(new Date())
            ,timeId :
                (function(date){
                    return date.getTime()
                })(new Date())
        }
        return create[getter];
    }

    Model.prototype.read = function(callback){
        var data = JSON.parse(localStorage.getItem(this.dbName));
        callback(data);
    }

    Model.prototype.create = function(parameter, callback){
        var self = this;
        var data = JSON.parse(localStorage.getItem(this.dbName));

        parameter = {
            ...parameter,
            id : self.timeLog('timeId'),
            timelog : `${self.timeLog('date')}<br>${self.timeLog('time')}`,
            favorite : false
        }

        data.push(parameter);
        localStorage.setItem(this.dbName, JSON.stringify(data));
        callback(data);
    }

    Model.prototype.delete = function(callback){
        console.log()
    }

    exports.app = exports.app || {};
    exports.app.Model = Model;
})(window);