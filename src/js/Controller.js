(function(exports){
    'use strict';

    function Controller(model, view){
        var self = this;
        this.view = view;
        this.model = model;

        this.view.bind('focusin');
        this.view.bind('blur');
        this.view.bind('keyup');
        this.view.bind('newMemo', function(parameter){
            self.addMemo(parameter);
        });
    }

    Controller.prototype.addMemo = function(parameter){
        var self = this;
        this.model.create(parameter, function(data){
            self.view.draw('show', data);
        });
    }

    exports.app = exports.app || {};
    exports.app.Controller = Controller;
})(window)