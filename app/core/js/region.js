/**
 * base_region.js
 * ------------------------------------------------------------------------
 * Manage views within a section of the page
 *
 * Inspired by Backbone.Marionette.region
 */
define(function () {
    'use strict';
    /**
     * Creates an instance of Region
     * @param {string|object} options String or object to specify the target el
     * @returns {Region}
     * @constructor
     */
    var Region = function (options) {
        if (_.isString(options)) {
            // new Region('#someElement');
            this.el = options;
        } else if (_.isObject(options) && options.el) {
            // new Region({
            //   el: ...,
            //   ...
            // });
            this.el = options.el;
            this.options = _.omit(options, 'el');
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

    // Copy backbone's extend method
    Region.extend = Backbone.Model.extend;

    _.extend(Region.prototype, {
        /**
         * Replace the current view with the passed view and append it to the DOM
         * @param {Backbone.View} view
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

            this.open(view.render());

            this.currentView = view;

            return this;
        },
        
        /**
         * Makes sure that $el is an instance of Backbone.$
         * @returns {this}
         */
        ensureEl: function () {
            if (!(this.$el instanceof Backbone.$) || this.$el.length === 0) {
                this.getEl(this.el);
            }
            return this;
        },

        /**
         * Set $el and el
         * @param {Backbone.$|string} element
         * @returns {this}
         */
        getEl: function (element) {
            if (element instanceof Backbone.$) {
                this.$el = element;
                this.el = element.selector;
            } else {
                this.$el = Backbone.$(element);
                this.el = element;
            }
            return this;
        },

        /**
         * Empty this.$el and append a view's el
         * @param {Backbone.View} view
         * @returns {this}
         */
        open: function(view){
            this.$el.empty().append(view.el);
            return this;
        },

        /**
         * Close the current view, and delete the reference to it
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
