(function(){
    var pick = function(selector){
        return document.querySelector(selector)
    };

    var viewModel = {
        writeTitle : pick('.writable__title'),
        writeContents : pick('.writable__contents'),
        writeButtonSubmit : pick('.wrtiable__button--save'),
        writeButtonCancel : pick('.wrtiable__button--cancel')
    }

    var togglePlaceholder = function(el, value){
        value ? el.style.display = 'none' : el.style.display = 'block'
    }

    var onKeyup = function(keyboardEvent){
        var el = keyboardEvent.target;
        var value = el.textContent;
        togglePlaceholder(el.previousElementSibling, value);
    }

    var writableSubmit = function(){

    }

    var textValidator = function(){

    }

    var init = function(){
        viewModel.writeTitle.addEventListener('keyup', onKeyup);
        viewModel.writeContents.addEventListener('keyup', onKeyup);
        viewModel.writeButtonSubmit.addEventListener('click', writableSubmit);
    }

    init();
})()