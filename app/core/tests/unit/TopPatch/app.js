$(document).ready(function () {
    'use strict';
    module('TopPatch/app');

    asyncTest('setDocumentTitle', function () {
        require(
            ['core/js/TopPatch/app'],
            function (TopPatch) {
                var App = TopPatch.App,
                    originalTitle = document.title;

                ok(App.setDocumentTitle('test'), 'Append "test" to document title');
                strictEqual(App._docTitle, originalTitle, 'Stored original document title correctly');
                strictEqual(document.title, originalTitle + App._docTitleSeparator + 'test', 'Appended "test" correctly');

                ok(App.setDocumentTitle(), 'Restore original document title');
                strictEqual(document.title, originalTitle, 'Restored document title correctly');

                start();
            }
        );
    });
});
