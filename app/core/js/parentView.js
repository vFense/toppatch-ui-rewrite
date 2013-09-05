/**
 * parentView.js
 * ------------------------------------------------------------------------
 * A Backbone.View that manages child views
 */
define(
    ['backbone.babysitter'],
    function () {
        'use strict';
        return Backbone.View.extend({
            // Zombie Prevention Part 1
            // Add close function to Backbone.View to prevent "Zombies"
            // Inspired by: Derick Bailey
            // See: http://bit.ly/odAfKo
            close: function () {
                if (!this.isClosed) {
                    // Call before close if it is a function
                    if (this.beforeClose && _.isFunction(this.beforeClose)) {
                        this.beforeClose();
                    }

                    this.isClosed = true;
                    // Clean, remove, and unbind this view
                    this.clean()
                        .remove()
                        .unbind();
                }
                return this;
            },

            clean: function () {
                this.closeChildViews()
                    .$el.empty();
                return this;
            },

            // Child sitting services
            // Heavily inspired by Backbone.Marionette.collectionView
            // ------------------------------------------------------------------------

            /**
             * Create a new instance of Backbone.ChildViewContainer if it does not already exist
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

            //TODO: This method prevents us from using custom babysitting indexes, refactor?
            registerChildView: function () {
                var that = this,
                    args = _.filter(arguments, function(arg) {
                        // Filter out any instances of "this" view
                        // Filter out any objects that are not an instance of Backbone.View
                        return arg !== that && arg instanceof Backbone.View;
                    });
                // Continue if there are any unfiltered arguments
                if (args.length > 0) {
                    this._initChildServices();
                    _.each(args, function (child) {
                        // See backbone.babysitter.js
                        this.children.add(child);
                    }, this);
                }
                return this;
            },

            /**
             * Close a child view
             * @param view
             * @returns {this}
             */
            closeChildView: function (view) {
                // Only close the view if it is a child of "this" view.
                if (view instanceof Backbone.View && this.children.contains(view)) {
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
