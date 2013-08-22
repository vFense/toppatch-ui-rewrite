// Region
//
// Inspired by Backbone.Marionette.region

define(
    ['core/js/base_deps'],
    function () {
        'use strict';
        var BaseRegion = function (options) {
            if (_.isString(options)) {
                // new BaseRegion('#someElement');
                this.el = options;
            } else if (_.isFunction(options)) {
                // new BaseRegion(function () {...});
                // User wants the el to be evaluated at show
                this.el = options;
            } else if (_.isObject(options) && options.el) {
                // new BaseRegion({...});
                this.options = options;
                this.el = this.options.el;
            }

            // this.el is REQUIRED
            if(!this.el) {
                throw new Error('An \'el\' must be specified for a region.');
            }

            // Run initialize if it exists and is a function
            if (_.isFunction(this.initialize)) {
                this.initialize.apply(this, _.toArray(arguments));
            }
        };

        // Copy backbone's extend method
        BaseRegion.extend = Backbone.Model.extend;

        _.extend(BaseRegion.prototype, {
            _ensureElement: function () {
                if (!(this.$el instanceof Backbone.$)) {
                    this.setElement(this.el);
                }
                return this;
            },
            _open: function(view){
                this.$el.empty().append(view.el);
                return this;
            },
            setElement: function (element) {
                if (element instanceof Backbone.$) {
                    this.$el = element;
                    this.el = element.selector;
                } else {
                    this.$el = Backbone.$(element);
                    this.el = element;
                }
                return this;
            },
            show: function (view) {
                if (!(view instanceof Backbone.View)) {
                    throw new TypeError('Show expects an instance of Backbone.View');
                }

                this._ensureElement();
                if (view !== this.currentView) {
                    this.close();
                }

                this._open(view.render());

                this.currentView = view;

                return this;
            },
            close: function () {
                var view = this.currentView;
                if (view instanceof Backbone.View) {
                    if (_.isFunction(view.close)) {
                        view.close();
                    } else {
                        view.remove();
                    }
                    delete this.currentView;
                }
                return this;
            },
            reset: function () {
                this.close();
                delete this.$el;
                return this;
            }
        });

        return BaseRegion;
    }
);
