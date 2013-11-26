$(document).ready(function () {
    'use strict';
    module('TopPatch/utils');

    asyncTest('setDocumentTitle', function () {
        require(
            ['core/js/TopPatch/utils'],
            function (TopPatch) {
                var Utils = TopPatch.Utils,
                    originalTitle = document.title;

                ok(Utils.setDocumentTitle('test'), 'Append "test" to document title');
                strictEqual(Utils._docTitle, originalTitle, 'Stored original document title correctly');
                strictEqual(document.title, originalTitle + Utils._docTitleSeparator + 'test', 'Appended "test" correctly');

                ok(Utils.setDocumentTitle(), 'Restore original document title');
                strictEqual(document.title, originalTitle, 'Restored document title correctly');

                start();
            }
        );
    });
});
