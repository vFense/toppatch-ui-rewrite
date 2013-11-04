define(function () {
    'use strict';
    /**
     * Manage views within a section of the page
     *
     * Inspired by Backbone.Marionette.region
     * @class Region
     * @deprecated
     * @param {string|object} options String or object to specify the target element
     * @returns {Region}
     * @constructor
     */
    var Region = function (options) {
        if (_.isString(options)) {
            // new Region('#someElement');
            this.el = options;
        } else if (_.isObject(options)) {
            // new Region({
            //   el: ...,
            //   ...
            // });
            _.extend(this, _.pick(options, 'el', 'parentEl'));
            this.options = _.omit(options, 'el', 'parentEl');
        }

        // this.el is REQUIRED
        if(!this.el) {
            throw new Error('A target \'el\' must be specified for a region.');
        }

        // Run initialize if it exists and is a function
        if (_.isFunction(this.initialize)) {
            this.initialize.apply(this, arguments);
        }

        return this;
    };

    /**
     * Copy Backbone.Model.extend to make Region extendable
     * @property extend
     * @type Function
     * @default Backbone.Model.extend
     * @final
     */
    Region.extend = Backbone.Model.extend;

    _.extend(Region.prototype, {
        /**
         * Replace the current view with the passed view and append it to the DOM
         * @method show
         * @param view {Backbone.View}
         * @chainable
         * @returns {this}
         */
        show: function (view) {
            if (!(view instanceof Backbone.View)) {
                throw new TypeError('Show expects an instance of Backbone.View');
            }

            this.ensureEl();
            if (view !== this.currentView) {
                this.close();
            }

            view.render().delegateEvents();
            this.open(view);

            this.currentView = view;

            return this;
        },
        
        /**
         * Makes sure that $el is an instance of jQuery
         * @method ensureEl
         * @chainable
         * @returns {this}
         */
        ensureEl: function () {
            if (!(this.$el instanceof $) || this.$el.length === 0) {
                this.$el = this.getEl(this.el);
            }
            return this;
        },

        /**
         * Return parentEl.find(selector) or $(selector)
         * @method getEl
         * @param selector {string}
         * @returns {jQuery} jQuery object representing this.$el
         */
        getEl: function (selector) {
            if (!_.isUndefined(this.parentEl)) {
                return _.result(this, 'parentEl').find(selector);
            } else {
                return $(selector);
            }
        },

        /**
         * replace this.$el's html with a view's el
         * @method open
         * @param view {Backbone.View}
         * @chainable
         * @returns {this}
         */
        open: function(view){
            this.$el.html(view.el);
            return this;
        },

        /**
         * Close the current view, and delete the reference to it
         * @method close
         * @chainable
         * @returns {this}
         */
        close: function () {
            var view = this.currentView;
            if (view instanceof Backbone.View) {
                if (_.isFunction(view.close)) {
                    view.close();
                } else {
                    view.remove();
                }
                delete this.currentView;
            }
            return this;
        },

        /**
         * Close the current view, and delete the $el reference
         * @method reset
         * @chainable
         * @returns {this}
         */
        reset: function () {
            this.close();
            delete this.$el;
            return this;
        }
    });

    return Region;
});
