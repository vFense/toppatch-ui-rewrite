$(document).ready(function () {
    'use strict';
    module('TemplateView');

    asyncTest('Constructor with options', function () {
        require(
            ['core/js/views/template'],
            function (TemplateView) {
                var templateView = new TemplateView({
                    template: 42
                });
                strictEqual(templateView.template, 42, 'Changed template correctly');
                start();
            }
        );
    });

    asyncTest('getData', function () {
        require(
            ['core/js/views/template'],
            function (TemplateView) {
                var Model, Collection;
                Model = Backbone.Model.extend({
                    defaults: {
                        name: 'World'
                    }
                });
                Collection = Backbone.Collection.extend({
                    model: Model
                });

                var view = new TemplateView();
                deepEqual(view.getData(), {}, 'Returns empty object when no model, or collection, is present');


                view.model = new Model();
                deepEqual(view.getData(), { name: 'World' }, 'Got model');

                view.collection = new Collection();
                deepEqual(view.getData(), { name: 'World' }, 'Got model, even when collection is present');

                var set = [
                    {name: 'Flying Dutchman'},
                    {name: 'Black Pearl'}
                ];
                view.collection.add(set);
                view.model = undefined;
                deepEqual(view.getData(), { items: set }, 'Got collection, when no model is present');

                start();
            }
        );
    });

    asyncTest('render [Handlebars Template]', function () {
        require(
            ['handlebars', 'core/js/views/template'],
            function (Handlebars, TemplateView) {
                var Model = Backbone.Model.extend({
                    defaults: {
                        name: 'World'
                    }
                });

                // The following is a pre-compiled template of:
                // <div>Hello {{ name }}!</div>
                var template = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
                    this.compilerInfo = [ 4, '>= 1.0.0' ];
                    helpers = this.merge(helpers, Handlebars.helpers);
                    data = data || {};
                    var buffer = '', stack1, functionType = 'function', escapeExpression = this.escapeExpression;
                    buffer += '<div>Hello ';
                    stack1 = helpers.name;
                    if (stack1) {
                        stack1 = stack1.call(depth0, {
                            hash: {},
                            data: data
                        });
                    } else {
                        stack1 = depth0.name;
                        stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
                    }
                    buffer += escapeExpression(stack1) + '!</div>';
                    return buffer;
                });

                var view = new TemplateView();
                view.model = new Model();

                QUnit.throws(function () { view.render(); }, TypeError, 'When template is not function, throws TypeError');

                view.template = template;
                view.render();
                strictEqual(view.$el.html(), '<div>Hello World!</div>', 'Template rendered correctly');

                start();
            }
        );
    });

    asyncTest('render [Lo-Dash Template]', function () {
        require(
            ['core/js/views/template'],
            function (TemplateView) {
                var Model = Backbone.Model.extend({
                    defaults: {
                        name: 'World'
                    }
                });

                var view = new TemplateView();
                view.model = new Model();
                view.template = _.template('<div>Hello <%= name%>!</div>');
                view.render();
                strictEqual(view.$el.html(), '<div>Hello World!</div>', 'Template rendered correctly');

                start();
            }
        );
    });
});
