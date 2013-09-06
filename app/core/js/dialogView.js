define(
    ['core/js/templateView', 'core/js/template/dialogView', 'bootstrap.modal'],
    function (templateView, template) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['animate', 'keyboard', 'backdrop'];

        return templateView.extend({
            className: 'modal',
            template: template,
            _isShown: false,

            // --------------------------------------------------------
            // variables to pass to bootstrap-modal
            // --------------------------------------------------------
            animate: false,
            keyboard: true,
            backdrop: true,

            /**
             * Extend this instance with keys of special meaning (see `viewOptions`),
             * then call the parent constructor
             * @param options
             * @returns {this}
             */
            constructor: function (options) {
                _.extend(this, _.pick(options, viewOptions));
                templateView.prototype.constructor.apply(this, arguments);
                return this;
            },
            
            events: function () {
                return _.extend({}, _.result(templateView.prototype, 'events'), {
                    'hidden': function () {
                        this._isShown = false;
                        this.close();
                    }
                });
            },

            // --------------------------------------------------------
            // Dialog utility methods
            // --------------------------------------------------------
            /**
             * Method to get the shown status of this DialogView
             * @returns {boolean}
             */
            isShown: function () { return this._isShown; },

            /**
             * Method to show the boostrap.modal
             * @returns {this}
             */
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

            /**
             * Method to hide the bootstrap.modal
             * Once hidden, this DialogView will close
             * @returns {this}
             */
            hide: function () {
                this.$el.modal('hide');
                return this;
            },

            beforeClose: function () {
                if (this._isShown) { this.hide(); }
                return this;
            }
        });
    }
);
