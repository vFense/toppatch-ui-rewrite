define(function () {
    'use strict';

    var Button = Backbone.Model.extend({
        defaults: {
            title: 'Button',
            style: 'btn-default',
            disabled: false,
            tag: 0,
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
            if (!_.isUndefined(attributes.tag) && !_.isNumber(attributes.tag)) {
                return 'Button.tag must be number';
            }
            if (isDefined(attributes.keyEquivalent) && !_.isNumber(attributes.keyEquivalent)) {
                return 'Button.keyEquivalent must be number';
            }
            return '';
        },
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
                // If this.model is an object, pass it to a new instance of Button.
                // Otherwise pass an empty object to create a default Button.
                this.model = new Button(_.isObject(this.model) ? this.model : {});
            }

            // We have functions that invoke setTimeout,
            // the timeout calls functions from this instance
            // This would cause errors without bindAll
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
            this._setTag();

            // Set up all events
            this.listenTo(this.model, 'change:title',   '_setTitle');
            this.listenTo(this.model, 'change:style',   '_setStyle');
            this.listenTo(this.model, 'change:disabled','_setDisabled');
            this.listenTo(this.model, 'change:tag',     '_setTag');
            this.delegateEvents();

            return this;
        },

        /**
         * Checks the button's key equivalent against the specified
         * event and, if they match, simulates the button being clicked.
         * @param event
         * @returns {boolean} true if the event key matches the button's keyEquivalent,
         *                    false if it does not match
         */
        performKeyEquivalent: function (event) {
            if (this.model.get('disabled')) { return false; }
            var keyEquivalent = this.model.get('keyEquivalent'),
                eventKey = _.result(event, 'which'),
                result = eventKey === keyEquivalent;

            if (result) {
                // We are handling the event here.
                // Stop propagation of the event.
                event.preventDefault()
                    .stopPropagation();
                this.performClick(true);
            }

            return result;
        },

        /**
         * Simulates a single mouse click on the control.
         * @returns {this}
         */
        performClick: function (animated) {
            // Only perform click if the element is visible
            if (this.$el.is(':visible')) {
                if (animated === true) {
                    this._startAnimatedClick();
                } else {
                    this.$el.trigger('click');
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
        _startAnimatedClick: function () {
            this.$el.addClass('active');
            if (!_.isNull(this._animatedClickTimeout)) {
                clearTimeout(this._animatedClickTimeout);
            }
            this._animatedClickTimeout = setTimeout(this._completeAnimatedClick, 100);
        },

        /**
         * Complete the animated click
         * @private
         */
        _completeAnimatedClick: function () {
            this.$el.removeClass('active');
            this._animatedClickTimeout = null;
            this.performClick(false);
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
        _setTag: function () {
            this.$el
                .data('tag', this.model.get('tag'))
            ;
            return this;
        }
    });

    return {
        Model: Button,
        View: View
    };
});
