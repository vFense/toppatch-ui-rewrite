/**
 * A module representing a Button.
 *
 * This module is actually a Model with some Backbone.View logic built in.
 * The model has its own $el and el, and will update its element properties
 * when the model attributes change
 *
 * @module Button
 */
define(function () {
    'use strict';

    /**
     * Button Model
     * @alias Button.Model
     */
    return Backbone.Model.extend({
        defaults: {
            title: 'Button',
            style: 'btn-default',
            disabled: false,
            tagID: 0,
            keyEquivalent: 0
        },

        /**
         * Construct this button
         * @returns {*}
         */
        constructor: function () {
            // Apply the prototype constructor first
            Backbone.Model.prototype.constructor.apply(this, arguments);

            // Setup element
            this._ensureElement();

            // Setup events
            this.on('change:title'   , this._changeTitle);
            this.on('change:style'   , this._changeStyle);
            this.on('change:disabled', this._changeDisabled);
            this.on('change:tagID'   , this._changeTagID);

            // Make sure that when _completeAnimatedClick is called
            // from a timeout, it has the correct `this` value
            _.bindAll(this, '_completeAnimatedClick');

            return this;
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

            // Trim the style
            if (_.isString(attrs.style)) {
                attrs.style = attrs.style.trim();
            }

            // Coerce keyEquivalent to character code
            if (_.isString(attrs.keyEquivalent)) {
                attrs.keyEquivalent = attrs.keyEquivalent.charCodeAt(0);
            }

            return Backbone.Model.prototype.set.call(this, attrs, options);
        },

        /**
         * Create the DOM element to represent this Button
         * @private
         */
        _ensureElement: function () {
            this.$el = Backbone.$('<button>');
            this.$el
                .attr({
                    id: _.result(this, 'cid'),
                    class: ['btn', _.result(this.attributes, 'style')].join(' ')
                })
                .data('tagID', _.result(this.attributes, 'tagID'))
                .text(_.result(this.attributes, 'title'));

            this.el = this.$el[0];

            return this;
        },

        /**
         * Take the element out of the DOM
         * @returns {*}
         */
        remove: function () {
            this.$el.remove();
            return this;
        },

        /**
         * Return true if this $el is enabled and visible
         * @returns {boolean}
         */
        canPerform: function () {
            var enabled = !this.get('disabled');
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
                var keyEquivalent = this.get('keyEquivalent'),
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
        _changeTitle: function () {
            this.$el
                .text(this.get('title'))
            ;
            return this;
        },

        /**
         * Update the Button's rendered style
         * @returns {*}
         * @private
         */
        _changeStyle: function () {
            this.$el
                .removeClass(this.previous('style'))
                .addClass(this.get('style'))
            ;
            return this;
        },

        /**
         * Update the Button's rendered disabled attribute
         * @returns {*}
         * @private
         */
        _changeDisabled: function () {
            this.$el
                .attr('disabled', this.get('disabled'))
            ;
            return this;
        },

        /**
         * Update the button's rendered data-tag attribute
         * @returns {*}
         * @private
         */
        _changeTagID: function () {
            this.$el
                .data('tagID', this.get('tagID'))
            ;
            return this;
        }
    });
});
