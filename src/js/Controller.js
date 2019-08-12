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
        this.bindEvents();
    }

    Controller.prototype.bindEvents = function(){
        this.view.bind('newMemo', function(title, contents){
            self.addMemo(
                { title, contents }
            );
        });
        this.view.bind('memoRemove', function(){
            self.removeMemo();
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
        console.log(event);
    }

    Controller.prototype.refresh = function(){
        var self = this;
        this.model.read(function(data){
            self.view.render(data);
        });
        self.bindEvents();
    }

    exports.app = exports.app || {};
    exports.app.Controller = Controller;
})(window)