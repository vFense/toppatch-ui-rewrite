define(
    [
        'respond',
        'jquery',
        'underscore',
        'backbone',
        'backbone.babysitter',
        'backbone.localStorage',
        'backbone.modelBinder',
        'backbone.validation',
        'es5-shim'
    ],
    function() {
        "use strict";
        GLOBALS.App = {
            vent: _.extend({}, Backbone.Events)
        };

        /*
         * ModelBinder 1.0.2 does not work with the latest underscore.
         * ModelBinder is AMD ready so we can't patch it in a shim.
         * This issue is already resolved in the ModelBinder repo,
         * but the fix has not been tagged yet.
         *
         * It may be wise to drop ModelBinder at this point and make
         * a dedicated base_model_view that has bidirectional event
         * bindings.
         */
        if (Backbone.ModelBinder.VERSION === '1.0.2') {
            var ModelBinder = function () {
                _.bindAll.apply(_, [this].concat(_.functions(this)));
            };
            _.extend(ModelBinder, Backbone.ModelBinder);
            _.extend(ModelBinder.prototype, Backbone.ModelBinder.prototype);
            Backbone.ModelBinder = ModelBinder;
        } else {
            console.warn('base_deps.js: Backbone.ModelBinder override no longer needed');
        }
    }
);
