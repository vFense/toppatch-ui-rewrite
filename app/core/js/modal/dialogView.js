define(
    ['core/js/templateView', 'core/template/dialogView', 'bootstrap.modal'],
    function (TemplateView, template) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['animate', 'keyboard', 'backdrop'];

        return TemplateView.extend({
            /**
             * A TemplateView that manages a Bootstrap Modal
             * @class DialogView
             * @extends TemplateView
             * @constructor
             * @param options
             * @returns {this}
             */
            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, viewOptions));
                }
                TemplateView.prototype.constructor.apply(this, arguments);
                this.toggleAnimate(this.animate);
                return this;
            },

            /**
             * @attribute className
             * @type String
             * @default 'modal'
             * @protected
             */
            className: 'modal',
            /**
             * @attribute template
             * @type function
             * @default Basic Modal Template
             * @protected
             */
            template: template,
            /**
             * Enable/Disable modal animations
             * @attribute animate
             * @type Boolean
             * @default true
             */
            animate: true,
            /**
             * Enable/Disable modal response to escape key
             * @attribute keyboard
             * @type boolean
             * @default true
             */
            keyboard: true,
            /**
             * Enable/Disable modal backdrop response to click
             * @attribute backdrop
             * @type boolean|'static'
             * @default true
             */
            backdrop: true,

            /**
             * A hash of attributes that will be set as HTML DOM element
             * attributes on the view's el (id, class, data-properties, etc.),
             * or a function that returns such a hash.
             * @attribute attributes
             * @type String|Function
             * @default Function
             * @protected
             */
            attributes: function () {
                return _.extend({}, _.result(TemplateView.prototype, 'attributes'), {
                    'tabindex': '-1',
                    'role': 'dialog'
                });
            },

            /**
             * Listen for the bootstrap.modal hidden event
             * Uses a function to inherit events
             * @attribute events
             * @type Object|Function
             * @default Object
             */
            events: _.extend({}, {
                'hidden.bs.modal': function () {
                    this.close();
                }
            }, _.result(TemplateView.prototype, 'events')),

            // --------------------------------------------------------
            // Dialog utility methods
            // --------------------------------------------------------
            /**
             * Method to get the shown status of this DialogView
             * Uses the Bootstrap Modal isShown value
             * @method isShown
             * @returns {boolean}
             */
            isShown: function () {
                var data = this.$el.data('bs.modal');
                return _.isUndefined(data) ? false : data.isShown;
            },

            /**
             * Method to show the boostrap.modal
             * @method open
             * @chainable
             * @returns {this}
             */
            open: function () {
                var $el = this.$el;
                if (!this.isShown()) {
                    if(this.isClosed === true || _.isUndefined(this.isClosed)) {
                        this.render();
                    }

                    this.delegateEvents();
                    
                    // Set bootstrap modal options
                    $el.modal({
                        keyboard: this.keyboard,
                        backdrop: this.backdrop
                    });
                }
                return this;
            },

            /**
             * Toggle the modal 'fade' class which instructs bootstrap.modal to animate
             * @method toggleAnimate
             * @param state {boolean} A boolean value to determine whether the class should be added or removed.
             * @chainable
             * @returns {this}
             */
            toggleAnimate: function (state) {
                if (_.isBoolean(state)) {
                    this.animate = state;
                } else {
                    this.animate = !this.animate;
                }
                this.$el.toggleClass('fade', this.animate);
                return this;
            },

            /**
             * Method to hide the bootstrap.modal
             * Once hidden, this DialogView will close
             * @method hide
             * @chainable
             * @returns {this}
             */
            hide: function () {
                this.$el.modal('hide');
                return this;
            },

            /**
             * If the bootstrap.modal is shown, hide it, then close this view
             * @method close
             * @chainable
             * @returns {this}
             */
            close: function () {
                if (!this.isClosed) {
                    if (this.isShown()) {
                        this.hide();
                    }
                    TemplateView.prototype.close.apply(this, arguments);
                }
                return this;
            }
        });
    }
);
