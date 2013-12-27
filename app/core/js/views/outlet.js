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
    ['core/js/views/region', 'core/template/outlet'],
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
             * Shortcut method for
             *
             * this.set(this._selector, view, {render:true});
             * @method show
             * @param view {View}
             * @chainable
             */
            show: function (view) {
                this.set(this._selector, view, {render: true});
                return this;
            }
        });
    }
);
