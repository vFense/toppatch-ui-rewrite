define(['underscore'], function() {
    'use strict';
    var patch = {};

    /*
     * ModelBinder 1.0.2 does not work with the latest underscore.
     * ModelBinder is AMD ready so we can't patch it in a shim.
     * This issue is already resolved in the ModelBinder repo,
     * but the fix has not been tagged yet.
     *
     * It may be wise to drop ModelBinder at this point and make
     * a dedicated base_model_view that has bidirectional event
     * bindings.
     *
     * This function can only be called once per session
     */
    patch.modelBinder = _.once(function () {
        if (!Backbone || !Backbone.ModelBinder) {
            window.console.warn('Backbone.ModelBinder is not loaded');
        }
        var version = Backbone.ModelBinder.VERSION;
        if (version === '1.0.2') {
            version = '1.0.2-patched';
            var ModelBinder = function () {
                _.bindAll.apply(_, [this].concat(_.functions(this)));
            };
            _.extend(ModelBinder, Backbone.ModelBinder);
            _.extend(ModelBinder.prototype, Backbone.ModelBinder.prototype);
            Backbone.ModelBinder = ModelBinder;
        } else {
            window.console.warn('Monkey Patch for [Backbone.ModelBinder] no longer needed');
        }
    });

    return patch;
});

