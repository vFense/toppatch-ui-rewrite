/**
 * base_view.js
 * ------------------------------------------------------------------------
 * Backbone.View function overrides
 *
 * Includes:
 *  Zombie Prevention
 *  Close method
 */
define(
    ['js/loading_indicator'],
    function (loading_indicator) {
        "use strict";
        var __super__ = Backbone.View.prototype;
        _.extend(__super__, {
            // Zombie Prevention Part 1
            // Add close function to Backbone.View to prevent "Zombies"
            // Inspired by: Derick Bailey
            // See: http://bit.ly/odAfKo
            close: function () {
                if (this.isClosing) { return this; }
                if (this.beforeClose && _.isFunction(this.beforeClose)) {
                    this.beforeClose();
                }
                this.isClosing = true;
                if (_.isArray(this.childViews)) {
                    _.each(this.childViews, function (childView) {
                        if (_.isFunction(childView.close)) {
                            childView.close();
                        }
                    });
                }
                this.remove();
                this.unbind();
                this.isClosing = false;
                return this;
            },

            addChildView: function () {
                if (!_.isArray(this.childViews)) {
                    this.childViews = [];
                }
                Array.prototype.push.apply(this.childViews, arguments);
                return this;
            },

            showLoading: function () {
                this.loadingIndicator = loading_indicator.spinner();
                return this.$el.html(this.loadingIndicator.el);
            },

            hideLoading: function () {
                if (this.loadingIndicator) {
                    this.loadingIndicator.remove();
                }
                return this;
            }
        });
    }
);
