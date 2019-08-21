(function(exports){
    'use strict';

    var tag = '[View]';

    function View(model){
        this.model = model;
        this.ENTER_CODE = 13;

        this.titlePlaceholder = '제목을 입력해주세요.';
        this.contentsPlaceholder = '내용을 입력해주세요.';
        this.$aside = qs('.memo-aside');
        this.$foldingButton = qs('.memo-aside-fold');
        this.$actionButtonArea = qs('.memo-write__action');
        this.$actionButtonSave = qs('[data-action="save"]');
        this.$newMemoButton = qs('.memo-aside__button--new');
        this.$memoCount = qsa('.memo-aside__button');
        this.$memoCountAll = qs('.count-number--all');
        this.$memoCountFavorite = qs('.count-number--favorite');
        this.$writeArea = qsa('.memo--write');
        this.$writeTitle = qsa('.memo__head.memo--write');
        this.$writeContents = qsa('.memo__body.memo--write');
        this.$listArea = qs('.memo-list-area');

        this.memoTemplate = qs('#MemoTemplate').innerHTML;
        this.palette = qs('#Palette').innerHTML;

        this.pickElements();
    }

    View.prototype.pickElements = function(){
        this.$memoItem = qsa('.memo-list-area>.memo');
        this.$memoList = qs('.memo-list-area');
        this.$memoFavorite = qsa('.memo__button--favorite');
        this.$memoDelete = qsa('.memo__button--delete');
    }

    View.prototype.bind = function(event, callback){
        var self = this;
        var eventBind = {
            resize : function(){
                $on(window, 'DOMContentLoaded', function(){
                    self.draw('resize');
                })
            },
            folding : function(){
                $on(self.$foldingButton, 'click', function(event){
                    self.draw('folding', event);
                });
            },
            newMemoFocus : function(){
                $on(self.$newMemoButton, 'click', function(event){
                    self.draw('newButtonClick', event)
                });
            },
            focusin : function(){
                $multipleEvent(self.$writeArea, 'focus', function(event){
                    self.draw('labelFocus', event)
                });
            },
            blur : function(){
                $multipleEvent(self.$writeArea, 'blur', function(event){
                    self.draw('focusout', event)
                });
            },
            keyup : function(){
                $multipleEvent(self.$writeArea, 'keyup', function(event){
                    self.draw('keyup', event)
                });
            },
            newMemo : function(){
                $on(self.$actionButtonSave, 'click', function(){
                    callback({
                        title : qs('[data-field="title"]').textContent,
                        contents : qs('[data-field="contents"]').textContent
                    })
                });
            },
            memoRemove : function(){
                $multipleEvent(self.$memoDelete, 'click', function(event){
                    callback(event);
                });
            },
            memoFavorite : function(){
                $multipleEvent(self.$memoFavorite, 'click', function(event){
                    callback(event);
                });
            },
            changeMemo : function(){
                $multipleEvent(self.$memoCount, 'click', function(event){
                    event.preventDefault();
                    callback(event);
                });
            },
            memoModify : function(){

            }
        }

        return eventBind[event]();
    }

    View.prototype.draw = function(command, param){
        var self = this;
        var eventCommand = {
            resize : function(){
                var windowHeight = window.innerHeight;
                var gap = ( qs('.header-wrapper').offsetHeight + qs('.footer-wrapper').offsetHeight);
                qs('.memo-wrapper').style.height = (windowHeight - gap)+'px';
            },
            folding : function(){
                param.preventDefault();
                qs('.container').classList.contains('on') ? qs('.container').classList.remove('on') : qs('.container').classList.add('on');
            },
            newButtonClick : function(){
                param.preventDefault();
                qs('[data-field="title"]').focus();
            },
            count : function(){
                self.$memoCountAll.innerHTML = param.all;
                self.$memoCountFavorite.innerHTML = param.favorite;
            },
            labelFocus : function(){
                var target = param.target;
                var targetText = target.textContent;

                if( self.titlePlaceholder === targetText || self.contentsPlaceholder === targetText ){
                    target.textContent = '';
                }
                self.$listArea.classList.add('on');
                self.$actionButtonArea.classList.add('on');
            },
            focusout : function(){
                var titleField = qs('[data-field="title"]');
                var contentsField = qs('[data-field="contents"]');

                if( !titleField.textContent ){
                    titleField.textContent = self.titlePlaceholder;
                }else if( !contentsField.textContent ){
                    contentsField.textContent = self.contentsPlaceholder;
                }

                if( titleField.textContent === self.titlePlaceholder && contentsField.textContent === self.contentsPlaceholder ){
                    self.$listArea.classList.remove('on');
                    self.$actionButtonArea.classList.remove('on');
                }
            },
            keyup : function(){
                var target = param.target;
                var targetField = target.dataset.field;
                if( event.keyCode === self.ENTER_CODE && targetField === 'title' ){
                    qs('[data-field="contents"]').focus();
                }
            },
            clear : function(){
                var titleField = qs('[data-field="title"]');
                    titleField.textContent = self.titlePlaceholder;
                var contentsField = qs('[data-field="contents"]');
                    contentsField.textContent = self.contentsPlaceholder;
                self.$listArea.classList.remove('on');
                self.$actionButtonArea.classList.remove('on');
            },
            favorite : function(){
                param.map( item => {
                    ( item.favorite )
                    ? qs(`.memo__button--favorite[data-id="${item.id}"]`).classList.add('on')
                    : qs(`.memo__button--favorite[data-id="${item.id}"]`).classList.remove('on');
                })
            }
        };
        return eventCommand[command]();
    }

    View.prototype.generator = function(data){
        var memo = '';

        data.forEach(item => {
            var template = this.memoTemplate;
                template = template.replace(/{{id}}/g, item.id);
                template = template.replace('{{date}}', item.timelog);
                template = template.replace('{{title}}', item.title);
                template = template.replace('{{contents}}', item.contents);
            memo = memo + template;
        });

        return memo;
    }

    View.prototype.render = function(data){
        var self = this;
        self.$memoList.innerHTML = self.generator(data);
        self.pickElements();
    }

    exports.app = exports.app || {};
    exports.app.View = View;
})(window);