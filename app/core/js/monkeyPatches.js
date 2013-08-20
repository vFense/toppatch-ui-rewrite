define(['underscore'], function() {
    'use strict';
    var patch = {};

    /**
     * Example patch for Backbone
     * Use Underscore's once method to ensure that the patch is only applied once
     */
    patch.examplePatch = _.once(function () {
        var applied = false;
        // Make sure to only apply the patch when a certain condition is met
        if (Backbone.VERSION === '1.0.0') {
            // Apply patch here
            applied = true;
        } else {
            // If the condition is not met
            // WARN that the patch may no longer be needed
            window.console.warn('Example monkey patch is no longer needed');
        }
        return applied;
    });

    return patch;
});

