/**
 * A module representing a Button.
 * @module Button
 */
define(function () {
    'use strict';

    /**
     * Button Model
     * @alias Button.Model
     */
    var Button = Backbone.Model.extend({
        defaults: {
            title: 'Button',
            style: 'btn-default',
            disabled: false,
            tagID: 0,
            keyEquivalent: 0
        },

        /**
         * Check the incoming attributes for errors.
         * If attributes[key] is defined, check its type.
         * If incorrect type found, returns error string.
         * If no errors are found, returns empty string.
         * @param attributes
         * @returns {String}
         */
        validate: function (attributes) {
            var isDefined = function (value) { return !_.isUndefined(value); };
            if (isDefined(attributes.title) && !_.isString(attributes.title)) {
                return 'Button.title must be string';
            }
            if (isDefined(attributes.style) && !_.isString(attributes.style)) {
                return 'Button.style must be string';
            }
            if (isDefined(attributes.disabled) && !_.isBoolean(attributes.disabled)) {
                return 'Button.disabled must be boolean';
            }
            if (!_.isUndefined(attributes.tagID) && !_.isNumber(attributes.tagID)) {
                return 'Button.tag must be number';
            }
            if (isDefined(attributes.keyEquivalent) && !_.isNumber(attributes.keyEquivalent)) {
                return 'Button.keyEquivalent must be number';
            }
            return '';
        },

        /**
         * Override default set method to run a few extra
         * steps before calling the original set method
         * @param key
         * @param [val]
         * @param [options]
         * @override
         * @returns {*}
         */
        set: function (key, val, options) {
            var attrs;
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            // Trim the title
            if (_.isString(attrs.title)) {
                attrs.title = attrs.title.trim();
            }

            // Coerce keyEquivalent to character code
            if (_.isString(attrs.keyEquivalent)) {
                attrs.keyEquivalent = attrs.keyEquivalent.charCodeAt(0);
            }

            return Backbone.Model.prototype.set.call(this, attrs, options);
        }
    });

    /**
     * Button View
     * @alias Button.View
     */
    var View = Backbone.View.extend({
        tag: 'button',
        className: 'btn',

        /**
         * Initialize this view
         * @returns {*}
         */
        initialize: function () {
            // If this.model is an instance of Button, do nothing
            if (!(this.model instanceof Button)) {
                // Construct a default button
                var button = new Button();


                if (_.isObject(this.model)) {
                    // If this.model is an object, send it to our new button
                    button.set(this.model);
                } else if (_.isString(this.model)) {
                    // If this.model is a string, assume the string is a title
                    button.set('title', this.model);
                }

                // Set this.model to reference button
                this.model = button;
            }

            // Check the model for validation errors
            if (!this.model.isValid()) {
                var error = new Error(this.model.validationError);
                error.name = 'InvalidButtonModel';
                throw error;
            }

            // Make sure that all functions called from this instance of Button.View
            // have "this" pointing to this instance of Button.View
            _.bindAll(this);

            return this;
        },

        /**
         * Setup attributes on this.$el, and setup all events
         * @returns {*}
         */
        render: function () {
            // Let render recreate all events
            // This helps prevent duplicate events from firing
            this.stopListening();

            this._setTitle();
            this._setStyle();
            this._setDisabled();
            this._setTagID();

            // Set up all events
            this.listenTo(this.model, 'change:title',   this._setTitle);
            this.listenTo(this.model, 'change:style',   this._setStyle);
            this.listenTo(this.model, 'change:disabled',this._setDisabled);
            this.listenTo(this.model, 'change:tagID',     this._setTagID);
            this.delegateEvents();

            return this;
        },

        /**
         * Return true if this $el is enabled and visible
         * @returns {boolean}
         */
        canPerform: function () {
            var enabled = !this.model.get('disabled');
            return enabled && this.$el.is(':visible');
        },

        /**
         * Checks the button's key equivalent against the specified
         * event and, if they match, simulates the button being clicked.
         * @param event {Event}
         * @param [animate] {boolean} Passed to performClick, if keyEquivalent match
         * @returns {boolean} true if the event key matches the button's keyEquivalent,
         *                    false if it does not match
         */
        performKeyEquivalent: function (event, animate) {
            // Continue only if the element is enabled and visible
            if (this.canPerform()) {
                var keyEquivalent = this.model.get('keyEquivalent'),
                    eventKey = _.result(event, 'which'),
                    result = eventKey === keyEquivalent;

                if (result) {
                    // We are handling the event here.
                    // Prevent default action
                    // Stop propagation of the event.

                    // Using _.result since direct invocation
                    // fails during unit testing
                    _.result(event, 'preventDefault');
                    _.result(event, 'stopPropagation');

                    this.performClick(animate);
                }

                return result;
            } else {
                return false;
            }
        },

        /**
         * Simulates a single mouse click on the control.
         * @param [animate] {boolean} Visually animate this click
         * @returns {*}
         */
        performClick: function (animate) {
            // Continue only if the element is enabled and visible
            if (this.canPerform()) {
                if (animate === true) {
                    this._startAnimatedClick();
                } else {
                    this.$el.click();
                }
            }
            return this;
        },

        /**
         * Keep reference to the timeout
         * @private
         */
        _animatedClickTimeout: null,

        /**
         * Start an animated click
         * @private
         */
        _startAnimatedClick: function (time) {
            if (!_.isNumber(time) || time < 0) {
                time = 100;
            }
            this.$el.addClass('active');
            if (!_.isNull(this._animatedClickTimeout)) {
                clearTimeout(this._animatedClickTimeout);
            }
            this._animatedClickTimeout = setTimeout(this._completeAnimatedClick, time);
            return this;
        },

        /**
         * Complete the animated click
         * @private
         */
        _completeAnimatedClick: function () {
            this.$el.removeClass('active');
            this._animatedClickTimeout = null;
            this.performClick(false);
            return this;
        },

        /**
         * Update the Button's rendered title
         * @returns {this}
         * @private
         */
        _setTitle: function () {
            this.$el
                .text(this.model.get('title'))
            ;
            return this;
        },

        /**
         * Update the Button's rendered style
         * @returns {*}
         * @private
         */
        _setStyle: function () {
            this.$el
                .removeClass(this.model.previous('style'))
                .addClass(this.model.get('style'))
            ;
            return this;
        },

        /**
         * Update the Button's rendered disabled attribute
         * @returns {*}
         * @private
         */
        _setDisabled: function () {
            this.$el
                .attr('disabled', this.model.get('disabled'))
            ;
            return this;
        },

        /**
         * Update the button's rendered data-tag attribute
         * @returns {*}
         * @private
         */
        _setTagID: function () {
            this.$el
                .data('tagID', this.model.get('tagID'))
            ;
            return this;
        }
    });

    return {
        Model: Button,
        View: View
    };
});
