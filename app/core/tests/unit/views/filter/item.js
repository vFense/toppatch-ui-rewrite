$(document).ready(function () {
    'use strict';
    module('views/filter/Item');

    asyncTest('constructor', function () {
        require(
            ['core/js/views/filter/item'],
            function (FilterItem) {
                var item;

                throws(function () {
                    item = new FilterItem();
                }, 'Throws error when name is not string');

                throws(function () {
                    item = new FilterItem({
                        name: 'test'
                    });
                }, 'Throws error when label is not string');

                item = new FilterItem({
                    name: 'test',
                    label: 'Test'
                });

                strictEqual(item.name, 'test', 'Name property is correct');
                strictEqual(item.label, 'Test', 'Label property is correct');

                start();
            }
        );
    });

    asyncTest('enabled and toggleEnabled', function () {
        require(
            ['core/js/views/filter/item'],
            function (FilterItem) {
                var item = new FilterItem({
                    name: 'test',
                    label: 'Test'
                });

                strictEqual(item.enabled(), false, 'item is disabled');
                ok(item.toggleEnabled(), 'Toggle enabled');
                strictEqual(item.enabled(), true, 'item is enabled');

                ok(item._enabled = 'invalid', 'Set _enabled property to value that is not a boolean');
                ok(item.toggleEnabled(true), 'Force enabled to true');
                strictEqual(item.enabled(), true, 'item is enabled');

                start();
            }
        );
    });
});
