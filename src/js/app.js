(function(){
    'use strict';

    function App(name){
        this.model = new app.Model(name);
        this.view = new app.View(this.model);
        this.controller = new app.Controller(this.model, this.view);
    }

    var leechoMemo = new App('memo');
})();