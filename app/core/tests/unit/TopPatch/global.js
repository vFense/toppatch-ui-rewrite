$(document).ready(function () {
    'use strict';
    module('TopPatch/global');

    asyncTest('extend', 3, function () {
        require(
            ['core/js/TopPatch/global'],
            function (TopPatch) {
                var extend = TopPatch.extend;

                ok(extend({'meaning of life': 42}), 'extend() ran without error');
                ok(_.has(TopPatch, 'meaning of life'), 'TopPatch now contains test key');
                strictEqual(TopPatch['meaning of life'], 42, 'TopPatch test value is correct');

                start();
            }
        );
    });

    asyncTest('noConflict', function () {
        require(
            ['core/js/TopPatch/global'],
            function () {
                var global = window.TopPatch;

                strictEqual(window.TopPatch.noConflict(), global, 'noConflict returned global object');
                notStrictEqual(window.TopPatch, global, 'window.TopPatch no longer points to global object');

                ok(window.TopPatch = 'test', 'Set window.TopPatch to "test"');
                ok(global.noConflict(), 'Run no conflict directly from the global object');
                strictEqual(window.TopPatch, 'test', 'noConflict did not change window.TopPatch');

                ok(window.TopPatch = global, 'Restore window.TopPatch to global object');
                deepEqual(window.TopPatch, global, 'Double check to make sure window.TopPatch is restored properly');

                start();
            }
        );
    });
});
