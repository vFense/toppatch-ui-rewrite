/**
 * A top level view intended to show sub views
 * in the $('#main') element within the template.
 *
 * Has a default template with a single <section>.
 *
 * @class OutletView
 * @extends TemplateView
 */
define(
    ['core/js/views/template', 'core/template/outlet'],
    function (TemplateView, template) {
        'use strict';
        return TemplateView.extend({
            /**
             * @attribute template
             * @type {function}
             * @default core/template/outlet
             */
            template: template,

            /**
             * @attribute _selector
             * @type {string}
             * @default '#main'
             * @private
             */
            _selector: '#main',

            /**
             * Show a view at template's $('#main')
             * @method show
             * @param view {View}
             * @chainable
             */
            show: function (view) {
                if(this.isClosed !== false) {
                    this.render().delegateEvents();
                }
                this.closeChildViews();
                this.$('#main').html(view.$el);
                this.currentView = view;
                return this;
            }
        });
    }
);
