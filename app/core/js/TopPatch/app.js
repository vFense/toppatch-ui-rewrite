define(
    ['underscore', 'exports'],
    function (_, exports) {
        'use strict';
        var App = exports.App = {};
        _.extend(App, {
            rootElement: '#toppatch-app',

            show: function (view) {
                if (this.currentView) {
                    this.currentView.close();
                }
                if (!this.$rootElement) {
                    this.$rootElement = $(this.rootElement);
                }
                this.$rootElement.html(view.$el);
                this.currentView = view;
                return this;
            },

            /**
             * @attribute _docTitleSeparator
             * @protected
             */
            _docTitleSeparator: ' | ',

            /**
             * @method setDocumentTitle
             * @param [title] {string} Title to append
             * @returns {string} The final document title
             */
            setDocumentTitle: function (title) {
                // backup document title
                if (_.isUndefined(this._docTitle)) {
                    this._docTitle = document.title;
                }

                var out;
                if (_.isString(title)) {
                    out = document.title = this._docTitle + this._docTitleSeparator + title;
                } else {
                    out = document.title = this._docTitle;
                }

                return out;
            }
        });
    }
);
