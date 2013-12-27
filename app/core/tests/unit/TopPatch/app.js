$(document).ready(function () {
    'use strict';
    module('TopPatch/app');

    asyncTest('show', function () {
        require(
            ['core/js/TopPatch/app'],
            function (App) {
                var element = $('<div>').attr('id', App.prototype.el.slice(1)).appendTo($('body')),
                    app = new App(),
                    simView1 = {$el: $('<div>').html('view1')},
                    simView2 = {$el: $('<div>').html('view2')},
                    called = 0;

                app.closeChildViews = function () {
                    called += 1;
                    return this;
                };

                app.show(simView1);
                strictEqual(app.$el[0].innerHTML, simView1.$el[0].outerHTML, 'html is correct');
                strictEqual(called, 1, 'Called closeChildViews');

                app.show(simView2);
                strictEqual(app.$el[0].innerHTML, simView2.$el[0].outerHTML, 'html is correct');
                strictEqual(called, 2, 'Called closeChildViews');

                app.show(simView2);
                strictEqual(app.$el[0].innerHTML, simView2.$el[0].outerHTML, 'html is correct');
                strictEqual(called, 2, 'Did NOT call closeChildViews');

                app.close();
                element.remove();
                start();
            }
        );
    });

    asyncTest('setDocumentTitle', function () {
        require(
            ['core/js/TopPatch/app'],
            function (App) {
                var app = new App(),
                    originalTitle = document.title;

                ok(app.setDocumentTitle('test'), 'Append "test" to document title');
                strictEqual(app._docTitle, originalTitle, 'Stored original document title correctly');
                strictEqual(document.title, originalTitle + app._docTitleSeparator + 'test', 'Appended "test" correctly');

                ok(app.setDocumentTitle(), 'Restore original document title');
                strictEqual(document.title, originalTitle, 'Restored document title correctly');

                start();
            }
        );
    });
});
