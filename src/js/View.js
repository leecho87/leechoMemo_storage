(function(exports){
    'use strict';

    var tag = '[View]';

    function View(model){
        this.ENTER_CODE = 13;
        this.model = model;

        this.titlePlaceholder = '제목을 입력해주세요.';
        this.contentsPlaceholder = '내용을 입력해주세요.';

        this.defaultTemplate =
        `<div class="memo" data-id="{{id}}">
            <div class="memo__info">
                <div class="memo__info-text">{{date}}</div>
                <div class="memo__info-button-wrap">
                    <button type="button" class="memo__button memo__button--favorite" data-id="{{id}}">즐겨찾기</button>
                    <button type="button" class="memo__button memo__button--delete" data-id="{{id}}">삭제</button>
                </div>
            </div>
            <div class="memo__head">{{title}}</div>
            <div class="memo__body">{{contents}}</div>
        </div>`;

        this.palette =
        `<section class="palette">
            <a href="#" class="palette__item palette__item--1" data-color="1"></a>
            <a href="#" class="palette__item palette__item--2" data-color="2"></a>
            <a href="#" class="palette__item palette__item--3" data-color="3"></a>
            <a href="#" class="palette__item palette__item--4" data-color="4"></a>
            <a href="#" class="palette__item palette__item--5" data-color="5"></a>
            <a href="#" class="palette__item palette__item--6" data-color="6"></a>
            <a href="#" class="palette__item palette__item--7" data-color="7"></a>
            <a href="#" class="palette__item palette__item--8" data-color="8"></a>
            <a href="#" class="palette__item palette__item--9" data-color="9"></a>
            <a href="#" class="palette__item palette__item--10" data-color="10"></a>
            <button type="button" class="palette__button">닫기</button>
        </section>`;

        this.pickElements();
    }

    View.prototype.pickElements = function(){
        this.$changeSelect = qs('.header__action-select');
        this.$actionButtonArea = qs('.header__action');
        this.$actionButtonSave = qs('[data-action="save"]');
        this.$actionButtonCancel = qs('[data-action="cancel"]');
        this.$writeArea = qsa('.memo--write');
        this.$writeTitle = qsa('.memo__head.memo--write');
        this.$writeContents = qsa('.memo__body.memo--write');
        this.$memoList = qs('.memo-list-area');
        this.$memoFavorite = qsa('.memo__button--favorite');
        this.$memoDelete = qsa('.memo__button--delete');
    }

    View.prototype.bind = function(event, handler){
        var self = this;

        if ( event === 'focusin' ) {
            $multipleEvent(self.$writeArea, 'focus', function(event){
                self.draw('labelFocus', event)
            });
        } else if ( event === 'blur' ) {
            $multipleEvent(self.$writeArea, 'blur', function(event){
                self.draw('focusout', event)
            });
        } else if ( event === 'keyup' ) {
            $multipleEvent(self.$writeArea, 'keyup', function(event){
                self.draw('keyup', event)
            });
        } else if ( event === 'newMemo' ) {
            $on(self.$actionButtonSave, 'click', function(){
                handler({
                    title : qs('[data-field="title"]').textContent,
                    contents : qs('[data-field="contents"]').textContent
                })
            });
        } else if ( event === 'memoRemove' ) {
            $multipleEvent(self.$memoDelete, 'click', function(event){
                handler(event);
            })
        } else if ( event === 'memoFavorite' ) {
            $multipleEvent(self.$memoFavorite, 'click', function(event){
                handler(event);
            })
        } else if ( event === 'changeMemo' ) {
            $on(self.$changeSelect, 'change', function(event){
                handler(event);
            })
        }
    }

    View.prototype.draw = function(command, param){
        var self = this;
        var eventCommand = {
            labelFocus : function(){
                var target = param.target;
                var targetText = target.textContent;

                if( self.titlePlaceholder === targetText || self.contentsPlaceholder === targetText ){
                    target.textContent = '';
                }

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
        eventCommand[command]();
    }

    View.prototype.generator = function(data){
        var memo = '';

        data.forEach(item => {
            var template = this.defaultTemplate;
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