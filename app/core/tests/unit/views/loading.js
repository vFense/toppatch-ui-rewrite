$(document).ready(function () {
    'use strict';
    module('views/Loading');

    asyncTest('render', function () {
        require(
            ['core/js/views/loading'],
            function (BaseLoaderView) {
                var loader = new BaseLoaderView();

                strictEqual(loader.render(), loader, 'Render method returns this');

                var $text = loader.$('[data-name="text"]');

                strictEqual($text.length, 1, 'The loading text area has been rendered');
                strictEqual($text.text(), '', 'The loading text area is blank by default');

                start();
            }
        );
    });

    asyncTest('setLoadingText', function () {
        require(
            ['core/js/views/loading'],
            function (BaseLoaderView) {
                var loader = new BaseLoaderView();
                loader.render()
                    .setLoadingText('test1');
                strictEqual(loader.$('[data-name="text"]').text(), 'test1', 'The loading text was set to test1');
                start();
            }
        );
    });

    asyncTest('getLoadingText', function () {
        require(
            ['core/js/views/loading'],
            function (BaseLoaderView) {
                var loader = new BaseLoaderView();
                loader.render()
                    .$('[data-name="text"]')
                    .text('test2');
                strictEqual(loader.getLoadingText(), 'test2', 'getLoadingText returned test2');
                start();
            }
        );
    });
});
