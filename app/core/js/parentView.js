/**
 * parentView.js
 * ------------------------------------------------------------------------
 * A BaseView that manages child views
 */
define(
    ['core/js/view', 'backbone.babysitter'],
    function (BaseView) {
        'use strict';
        return BaseView.extend({
            // override clean method to close all child views
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
