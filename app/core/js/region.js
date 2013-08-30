/**
 * base_region.js
 * ------------------------------------------------------------------------
 * Manage views within a section of the page
 *
 * Inspired by Backbone.Marionette.region
 */
define(
    ['core/js/base_deps'],
    function () {
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
                this.options = options;
                this.el = this.options.el;
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
             * Makes sure that $el is an instance of Backbone.$
             * @returns {this}
             * @private
             */
            _ensureElement: function () {
                if (!(this.$el instanceof Backbone.$)) {
                    this.setElement(this.el);
                }
                return this;
            },

            /**
             * Empty this.$el and append a view's el
             * @param {Backbone.View} view
             * @returns {this}
             * @private
             */
            _open: function(view){
                this.$el.empty().append(view.el);
                return this;
            },

            /**
             * Set $el and el
             * @param {Backbone.$|string} element
             * @returns {this}
             */
            setElement: function (element) {
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
             * Replace the current view with the passed view and append it to the DOM
             * @param {Backbone.View} view
             * @returns {this}
             */
            show: function (view) {
                if (!(view instanceof Backbone.View)) {
                    throw new TypeError('Show expects an instance of Backbone.View');
                }

                this._ensureElement();
                if (view !== this.currentView) {
                    this.close();
                }

                this._open(view.render());

                this.currentView = view;

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
    }
);