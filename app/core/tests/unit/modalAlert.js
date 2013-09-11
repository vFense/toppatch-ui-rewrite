$(document).ready(function () {
    'use strict';
    module('AlertView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert;
                alert = new AlertView();

                ok(true);
                start();
            }
        );
    });
});