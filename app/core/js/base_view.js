/**
 * base_view.js
 * ------------------------------------------------------------------------
 * Supplemental Backbone.View functions
 *
 * Includes:
 *  Zombie Prevention
 *      Close method
 *  Child Services
 *      Register Child View
 *      Close Child View
 *      Close Child Views
 *  Loading indicator
 */
define(
    ['jquery', 'backbone', 'backbone.babysitter'],
    function () {
        "use strict";
        return Backbone.View.extend({
            // Zombie Prevention Part 1
            // Add close function to Backbone.View to prevent "Zombies"
            // Inspired by: Derick Bailey
            // See: http://bit.ly/odAfKo
            close: function () {
                // Only proceed if not already closing
                if (!this.isClosing) {
                    // Declare that this view is closing
                    this.isClosing = true;

                    // Call before close if it is a function
                    if (this.beforeClose && _.isFunction(this.beforeClose)) {
                        this.beforeClose();
                    }

                    // Close child views, then remove and unbind this view
                    this.closeChildViews()
                        .remove()
                        .unbind();

                    // Closing has completed
                    this.isClosing = false;
                }
                return this;
            },

            // Child sitting services
            // Heavily inspired by Backbone.Marionette.collectionView
            // ------------------------------------------------------------------------
            _initChildServices: function () {
                this.children = new Backbone.ChildViewContainer();
                return this;
            },
            registerChildView: function () {
                var that = this,
                    args = _.filter(_.toArray(arguments), function(arg) { return arg !== that && arg instanceof Backbone.View; });
                if (args.length > 0) {
                    if (!(this.children instanceof Backbone.ChildViewContainer)) {
                        this._initChildServices();
                    }
                    _.each(args, function (child) {
                        if (child instanceof Backbone.View) {
                            this.children.add(child);
                        }
                    }, this);
                }
                return this;
            },

            closeChildView: function (view) {
                if (view instanceof Backbone.View) {
                    if (_.isFunction(view.close)) {
                        view.close();
                    } else if (_.isFunction(view.remove)) {
                        view.remove();
                    }
                    this.children.remove(view);
                }
                return this;
            },
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
