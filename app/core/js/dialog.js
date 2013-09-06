define(
    ['core/js/layoutView', 'core/js/template/dialog', 'bootstrap.modal'],
    function (Layout, template) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['animate', 'keyboard', 'backdrop'];

        return Layout.extend({
            className: 'modal',
            template: template,
            _isShown: false,

            // --------------------------------------------------------
            // variables to pass to bootstrap-modal
            // --------------------------------------------------------
            animate: false,
            keyboard: true,
            backdrop: true,

            regions: {
                header: '.modal-header',
                body: '.modal-body',
                footer: '.modal-footer'
            },

            /**
             * Extend this instance with keys of special meaning (see `viewOptions`),
             * then call the parent constructor
             * @param options
             * @returns {this}
             */
            constructor: function (options) {
                _.extend(this, _.pick(options, viewOptions));
                Layout.prototype.constructor.apply(this, arguments);
                return this;
            },
            
            events: function () {
                _.extend({}, _.result(Layout.prototype, 'events'), {
                    'hidden': function () {
                        this._isShown = false;
                        this.close();
                    }
                });
            },

            // --------------------------------------------------------
            // Dialog utility methods
            // --------------------------------------------------------
            isShown: function () { return this._isShown; },

            open: function () {
                var $el = this.$el;
                if (!this._isShown) {
                    this.delegateEvents();
                    
                    // Set bootstrap modal options
                    $el.modal({
                        keyboard: this.keyboard,
                        backdrop: this.backdrop
                    });

                    this._isShown = true;
                }

                return this;
            },

            hide: function () { this.$el.modal('hide'); return this; },

            cancel: function () { return this.hide(); },

            confirm: function () { return this.hide(); },

            beforeClose: function () {
                if (this._isShown) { this.hide(); }
                return this;
            }
        });
    }
);
