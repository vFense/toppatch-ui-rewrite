define(
    ['core/js/views/view'],
    function (View) {
        'use strict';
        return View.extend({
            el: '#toppatch-app',

            show: function (view) {
                if (this.$el.children().first()[0] !== view.$el[0]) {
                    this.closeChildViews()
                        .$el.html(view.$el);
                }
                return this;
            },

            /**
             * @attribute _docTitleSeparator
             * @protected
             */
            _docTitleSeparator: ' | ',

            /**
             * Append a string to the document title
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
