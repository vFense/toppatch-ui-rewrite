/**
 * parentView.js
 * ------------------------------------------------------------------------
 * A Backbone.View with close and clean methods
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
                this.$el.empty();
                return this;
            }
        });
    }
);
