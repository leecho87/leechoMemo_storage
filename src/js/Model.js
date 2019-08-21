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

    Model.prototype.getStorage = function(){
        return JSON.parse(localStorage.getItem(this.dbName));
    }

    Model.prototype.setStorage = function(data){
        return localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    Model.prototype.getCount = function(){
        var data = this.getStorage();
        var all = 0;
        var favorite = 0;
        data.map(item => {
            if( item.favorite ){
                favorite++;
            }
            all++;
        });

        return { all, favorite };
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

    Model.prototype.read = function(callback, flag){
        var data = this.getStorage();
        var resultData;

        if(flag === 'favorite'){
            resultData = data.filter( item => {
                return item.favorite === true;
            });
        }else{
            resultData = data;
        }

        callback(resultData);
    }

    Model.prototype.create = function(parameter, callback){
        var self = this;
        var data = this.getStorage();

        parameter = {
            ...parameter,
            id : String(self.timeLog('timeId')),
            timelog : `${self.timeLog('time')}`,
            favorite : false
        }

        data.unshift(parameter);
        this.setStorage(data);
        callback(data);
    }

    Model.prototype.delete = function(id, callback){
        var data = this.getStorage();
        var modifyData = data.filter( item => {
            return item.id != id
        });
        this.setStorage(modifyData);
        callback();
    }

    Model.prototype.favorite = function(id, callback){
        var self = this;
        var data = this.getStorage();
        var modifyData = data.map( item => {
            if(item.id == id) {
                item.timelog = self.timeLog('time');
                item.favorite = !item.favorite;
            }
            return item;
        });
        this.setStorage(modifyData);
        callback(modifyData);
    }

    exports.app = exports.app || {};
    exports.app.Model = Model;
})(window);