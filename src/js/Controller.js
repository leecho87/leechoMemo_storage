(function(exports){
    'use strict';

    var tag = '[Controller]';

    function Controller(model, view){
        var self = this;
        this.view = view;
        this.model = model;

        this.view.bind('focusin');
        this.view.bind('blur');
        this.view.bind('keyup');
        this.view.bind('newMemo', function(param){
            self.addMemo(param);
        });
        this.view.bind('changeMemo', function(event){
            self.changeMemo(event);
        });
        this.bindEvents();
    }

    Controller.prototype.bindEvents = function(){
        var self = this;
        this.view.bind('memoRemove', function(event){
            self.removeMemo(event);
        });

        this.view.bind('memoFavorite', function(event){
            self.favoriteMemo(event);
        });
    }

    Controller.prototype.addMemo = function(parameter){
        var self = this;
        this.model.create(parameter, function(data){
            self.view.draw('clear');
            self.refresh();
        });
    }

    Controller.prototype.removeMemo = function(event){
        var self = this;
        var memoId = event.target.dataset.id;

        this.model.delete(memoId, function(){
            self.refresh();
        });
    }

    Controller.prototype.favoriteMemo = function(event){
        var self = this;
        var memoId = event.target.dataset.id;

        this.model.favorite(memoId, function(){
            self.refresh();
        });
    }

    Controller.prototype.changeMemo = function(event){
        var self = this;
        var category = event.target.value;

        this.model.read(function(data){
            self.view.render(data);
            self.view.draw('favorite', data);
        }, category);
    }

    Controller.prototype.refresh = function(){
        var self = this;
        this.model.read(function(data){
            self.view.render(data);
            self.view.draw('favorite', data);
        });
        self.bindEvents();
    }

    exports.app = exports.app || {};
    exports.app.Controller = Controller;
})(window);