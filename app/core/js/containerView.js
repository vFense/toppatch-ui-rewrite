/**
 * A View that manages child views
 *
 * @class ParentView
 * @extends View
 */
define(
    ['core/js/view', 'backbone.babysitter'],
    function (View) {
        'use strict';
        return View.extend({
            constructor: function () {
                View.prototype.constructor.apply(this, arguments);
                this._initChildServices();
                return this;
            },

            /**
             * Override clean method to close all child views
             * @method clean
             * @override
             * @chainable
             * @returns {this}
             */
            clean: function () {
                this.closeChildViews()
                    .$el.empty();
                return this;
            },

            /**
             * Create a new instance of Backbone.ChildViewContainer if it does not already exist
             * @method _initChildServices
             * @chainable
             * @returns {this}
             * @private
             */
            _initChildServices: function () {
                if (!(this.children instanceof Backbone.ChildViewContainer)) {
                    // Backbone.ChildViewContainer (backbone.babysitter.js)
                    this.children = new Backbone.ChildViewContainer();
                }
                return this;
            },

            /**
             * Register a single child view
             * @method registerChildView
             * @param view {Backbone.View} A backbone.view to track as a child of this view.
             * @param [name] {String} A name to reference the child by.
             * @returns {*}
             */
            registerChildView: function (view, name) {
                if (view !== this && view instanceof Backbone.View) {
                    this.children.add(view, name);
                }
                return this;
            },

            /**
             * Register multiple childViews
             * @method registerChildViews
             * @param views A group of views to track.
             *        The group can be passed as an Array, an Object, or multiple arguments
             * @returns {*}
             */
            registerChildViews: function (views) {
                if (views instanceof Backbone.View) {
                    views = _.toArray(arguments);
                }

                var isObject = _.isObject(views);

                _.each(views, function (view, key) {
                    this.registerChildView(view, isObject && key);
                }, this);

                return this;
            },

            /**
             * Close a child view
             * @method closeChildView
             * @param view {Backbone.View}
             * @chainable
             * @returns {this}
             */
            closeChildView: function (view) {
                // Only close the view if it is a child of "this" view.
                if (view instanceof Backbone.View && this.children.contains(view)) {
                    this.stopListening(view);

                    if (_.isFunction(view.close)) {
                        view.close();
                    } else {
                        view.remove();
                    }

                    this.children.remove(view);
                }
                return this;
            },

            /**
             * Close all child views
             * @method closeChildViews
             * @chainable
             * @returns {this}
             */
            closeChildViews: function () {
                if (this.children instanceof Backbone.ChildViewContainer) {
                    this.children.each(function(child){
                        this.closeChildView(child);
                    }, this);
                }
                return this;
            }
        });
    }
);
