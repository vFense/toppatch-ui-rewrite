$(document).ready(function () {
    'use strict';
    module('AlertView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/modalAlert'],
            function (AlertView) {
                var dialog;
                dialog = new AlertView();
                /*
                 // Instance Attributes
                 alertStyle: 'info',
                 messageText: 'Alert',
                 informativeText: '',
                 icon: '',
                 buttons: {},
                 */

                start();
            }
        );
    });
});