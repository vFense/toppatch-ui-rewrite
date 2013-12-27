define(
    ['core/js/views/template'],
    function (TemplateView) {
        'use strict';
        return TemplateView.extend({
            /**
             * A TemplateView that manages regions
             * @class Region
             * @extends TemplateView
             * @constructor
             * @returns {this}
             */
            constructor: function (options) {
                var regions = _.result(options, 'regions');
                this.regions = {};
                if (_.isObject(regions)) { this.set(regions); }
                return TemplateView.prototype.constructor.apply(this, arguments);
            },

            get: function (attr) { return this.regions[attr]; },

            /**
             * Set a hash of regions (one or many) on the regions property
             *
             * Based on [Backbone.Model.set](http://backbonejs.org/#Model-set)
             * @method set
             * @param key {string|object}
             * @param [value] {*}
             * @param [options] {object}
             * @chainable
             */
            set: function (key, value, options) {
                var attrs, unset, render, current, changes;

                // Parse arguments
                if (_.isUndefined(key) || _.isNull(key)) { return this; }

                if (_.isObject(key)) {
                    attrs = key;
                    options = value;
                } else {
                    (attrs = {})[key] = value;
                }

                if (!_.isObject(options)) {
                    options = {};
                }

                unset   = options.unset;
                render  = options.render;
                changes = [];
                current = this.regions;

                // Set regions
                _.forIn(attrs, function (attr, key) {
                    if (!_.isEqual(current[key], attr)) {
                        changes.push(key);

                        _.result(current[key], 'close');
                    }

                    if (unset) {
                        delete current[key];
                    } else {
                        current[key] = attr;
                    }
                }, this);

                // Render if options.render is true and there are changes
                if (render) {
                    if (this.isClosed !== false) {
                        this.render();
                    } else if (changes.length) {
                        this._partialRender(_.pick(current, changes));
                    }
                }

                return this;
            },

            /**
             * @method unset
             * @param attr
             * @param [options]
             * @chainable
             */
            unset: function (attr, options) {
                return this.set(attr, void 0, _.extend({}, options, { unset: true }));
            },

            /**
             * @method clear
             * @param [options]
             * @chainable
             */
            clear: function(options) {
                var attrs = _.mapValues(this.regions, function () { return void 0; });
                return this.set(attrs, _.extend({}, options, { unset: true }));
            },

            /**
             * @method _renderRegion
             * @param content
             * @param selector
             * @chainable
             * @private
             */
            _renderRegion: function (content, selector) {
                if (content.isClosed !== false) {
                    _.result(content, 'render');
                }
                var out = content.$el || content;
                this.$(selector).html(out);
                return this;
            },

            /**
             * @method _partialRender
             * @param changed
             * @chainable
             * @private
             */
            _partialRender: function (changed) {
                _.forIn(changed, this._renderRegion, this);
                return this;
            },

            /**
             * @method render
             * @chainable
             */
            render: function () {
                TemplateView.prototype.render.apply(this, arguments);
                _.forIn(this.regions, this._renderRegion, this);
                return this;
            }
        });
    }
);
