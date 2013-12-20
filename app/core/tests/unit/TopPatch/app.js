$(document).ready(function () {
    'use strict';
    module('TopPatch/app');

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
