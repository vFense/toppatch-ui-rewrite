define(
    [],
    function () {
        'use strict';
        return Backbone.View.extend({
            /**
             * A Backbone.View with close and clean methods
             *
             * @class View
             * @extends Backbone.View
             * @constructor
             * @chainable
             */
            constructor: function () {
                Backbone.View.prototype.constructor.apply(this, arguments);
                this.$el
                    .attr('data-backbone-view', this.cid)
                    .data('view', this)
                ;
                return this;
            },
            /**
             * Call beforeClose, if defined, then
             * Clean, remove, and unbind this View
             * @method close
             * @chainable
             */
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

            /**
             * Close any child instances of View
             * @method closeChildViews
             * @chainable
             */
            closeChildViews: function () {
                this.$('[data-backbone-view]').each(function () {
                    var view = $(this).data('view');
                    if (view instanceof Backbone.View) {
                        if (_.isFunction(view.close)) {
                            view.close();
                        } else {
                            view.remove();
                        }
                    }
                });
                return this;
            },

            /**
             * Empty this.$el
             * @method clean
             * @chainable
             */
            clean: function () {
                this.$el.empty();
                return this;
            }
        });
    }
);
