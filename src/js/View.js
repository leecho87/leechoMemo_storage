(function(exports){
    'use strict';

    function View(model){
        this.ENTER_CODE = 13;
        this.model = model;

        this.titlePlaceholder = '제목을 입력해주세요.';
        this.contentsPlaceholder = '내용을 입력해주세요.';

        this.$actionButtonArea = qs('.header__action');
        this.$actionButtonSave = qs('[data-action="save"]');
        this.$actionButtonCancel = qs('[data-action="cancel"]');
        this.$writeArea = qsa('.memo--write');
        this.$memolist = qs('.memo-list-area');

        this.defaultMemo =
        `<div class="memo" data-id="{{id}}">
            <div class="memo__info">
                <div class="memo__info-text">{{date}}</div>
                <div class="memo__info-button-wrap">
                    <button type="button" class="memo__button memo__button--favorite" data-id="{{id}}">즐겨찾기</button>
                    <button type="button" class="memo__button memo__button--delete" data-id="{{id}}">삭제</button>
                </div>
            </div>
            <div class="memo__head">{{title}}</div>
            <div class="memo__body">{{contents}}, {{favorite}}, {{timelog}}</div>
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
    }

    View.prototype.bind = function(event, handler){
        var self = this;
        if( event === 'focusin' ){
            $multipleEvent(self.$writeArea, 'focus', function(event){
                self.draw('labelFocus', event)
            });
        }else if( event === 'blur' ){
            $multipleEvent(self.$writeArea, 'blur', function(event){
                self.draw('focusout', event)
            });
        }else if( event === 'keyup' ){
            $multipleEvent(self.$writeArea, 'keyup', function(event){
                self.draw('keyup', event)
            });
        }else if( event === 'newMemo' ){
            $on(self.$actionButtonSave, 'click', function(){
                handler({
                    title : qs('[data-field="title"]').textContent,
                    contents : qs('[data-field="contents"]').textContent
                })
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
                var target = event.target;
                var targetField = target.dataset.field;

                if( !target.textContent && targetField === 'title' ){
                    target.textContent = self.titlePlaceholder;
                }else if( !target.textContent && targetField === 'contents' ){
                    target.textContent = self.contentsPlaceholder;
                    self.$actionButtonArea.classList.remove('on');
                }
            },
            keyup : function(){
                var target = event.target;
                var targetField = target.dataset.field;
                if( event.keyCode === self.ENTER_CODE && targetField === 'title' ){
                    qs('[data-field="contents"]').focus();
                }
            },
            save : function(){
                var target = event.target;
                var title = qs('[data-field="title"]').textContent;
                var contents = qs('[data-field="contents"]').textContent;
                //console.log('view, save, title = ' ,title)
                //console.log('view, save, contents = ' ,contents)
            },
            show : function(){
                self.$memolist.innerHTML = self.generateMemo(param);
            }
        };
        eventCommand[command]();
    }

    View.prototype.generateMemo = function(data){
        var view = ``;
        for(var i=0; i<data.length; i++){
            var template = this.defaultMemo;

            template = template.replace('{{id}}', i);
            template = template.replace('{{title}}', data[i].title);
            template = template.replace('{{contents}}', data[i].contents);
            template = template.replace('{{favorite}}', data[i].favorite);
            template = template.replace('{{date}}', data[i].timelog);

            view = view + template;
        }
        return view;
    }


    exports.app = exports.app || {};
    exports.app.View = View;
})(window);