$(document).ready(function () {
    'use strict';
    module('TemplateView');

    asyncTest('getData', function () {
        require(
            ['core/js/templateView'],
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
                deepEqual(view.getData(), {}, 'Returns empty object whe no model, or collection, is presnet');


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
});
