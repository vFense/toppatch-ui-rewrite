define(
    function () {
        'use strict';
        return function () {
            TopPatch.Auth.signOut().then(
                _.bind(function () {
                    return this.navigate('login', {trigger:true, replace: true});
                }, this)
            );
            return this;
        };
    }
);
