/**
 * base_view.js
 * ------------------------------------------------------------------------
 * Backbone.View function overrides
 *
 * Includes:
 *  Zombie Prevention
 *      Close method
 *      addSubViews
 *      closeChildViews
 *  Loading indicator
 */
define(
    ['core/js/loading_indicator', 'jquery', 'backbone'],
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
                this.closeChildViews()
                    .remove()
                    .unbind();
                this.isClosing = false;
                return this;
            },

            registerChildView: function () {
                if (!_.isArray(this.childViews)) {
                    this.childViews = [];
                }
                Array.prototype.push.apply(this.childViews, arguments);
                return this;
            },

            closeChildViews: function () {
                if (_.isArray(this.childViews)) {
                    _.each(this.childViews, function (childView) {
                        if (_.isFunction(childView.close)) {
                            childView.close();
                        }
                    });
                }
                return this;
            },

            _loadingIndicator: undefined,
            getLoadingIndicator: function () {
                if (_.isUndefined(this._loadingIndicator)) {
                    this._loadingIndicator = new loading_indicator.View();
                }
                return this._loadingIndicator;
            },
            showLoading: function () {
                return this.$el.html(_.result(this, 'getLoadingIndicator').el);
            },

            hideLoading: function () {
                if (_.result(this, 'getLoadingIndicator')) {
                    _.result(this, 'getLoadingIndicator').close();
                }
                return this;
            }
        });
    }
);
