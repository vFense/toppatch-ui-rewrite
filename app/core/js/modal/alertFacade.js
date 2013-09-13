/**
 * alertFacade.js
 * --------------------------------------------------------------------
 * A facade for alertView.js
 *
 * A facade is an object that provides a simplified interface to a
 * larger body of code, such as a class library.
 * See: bit.ly/gYAK9
 * See: bit.ly/191rQO9
 */
define(
    ['core/js/modal/alertView'],
    function (AlertView) {
        'use strict';

        /**
         *
         * @type {Backbone.Model}
         */
        var AlertButton = Backbone.Model.extend({
            defaults: {
                title: 'Button',
                tag: 0,
                style: 'btn-default',
                keyEquivalent: ''
            }
        });

        /**
         *
         * @param message {string}
         * @param information {string}
         * @param defButton {AlertButton}
         * @param altButton {AlertButton}
         * @param othButton {AlertButton}
         * @returns {*}
         */
        var getAlertView = function (message, information, defButton, altButton, othButton) {
            var alert = new AlertView();
            alert.setMessage(message)
                .setInformation(information)
                .setButton('defButton', defButton)
                .setButton('altButton', altButton)
                .setButton('othButton', othButton)
            ;
            return alert;
        };


    }
);