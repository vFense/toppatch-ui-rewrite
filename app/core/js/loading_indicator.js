define(
    ['text!core/templates/loading_indicator.html', 'base_view', 'backbone.modelBinder'],
    function (template, base_view) {
        "use strict";
        return base_view.extend({
            className: 'loading_indicator',
            _template: _.template(template),
            _Model: Backbone.Model.extend({
                defaults: {
                    'text': ''
                }
            }),
            _modelBinder: undefined,
            initialize: function () {
                this.model = new this._Model();
                this._modelBinder = new Backbone.ModelBinder();
                this.render();
            },
            render: function () {
                if (!this.$spinner) { this.$spinner = this._template(); }
                this.$el.html(this.$spinner);
                this._modelBinder.bind(this.model, this.el, {
                    'text': '[data-name=text]'
                });
                return this;
            },
            setLoadingText: function (text) {
                this.model.set('text', text);
            },
            getLoadingText: function (text) {
                this.model.get('text');
            }
        });
    }
);
