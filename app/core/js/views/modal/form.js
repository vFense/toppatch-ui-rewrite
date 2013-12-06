define(
    [
        'core/js/views/modal/modal',
        'core/js/views/form/form'
    ],
    function (ModalView, Form) {
        'use strict';
        // Borrow viewOptions, and methods from forms/form.js
        var viewOptions = ['validate'],
            mixin = _.pick(Form.prototype, ['submit', 'serializeForm', 'isValid', '_validate']);

        /**
         * A ModalView that manages a Form
         * @class modal/FormView
         * @extends ModalView
         * @constructor
         * @param options
         * @returns {this}
         */
        mixin.constructor = function (options) {
            if (_.isObject(options)) {
                _.extend(this, _.pick(options, viewOptions));
            }
            ModalView.prototype.constructor.apply(this, arguments);

            return this;
        };

        /**
         * Combine modal and form events
         * @attribute events
         * @type {Object}
         */
        mixin.events = _.extend(
            _.result(ModalView.prototype, 'events'),
            _.result(Form.prototype, 'events')
        );

        /**
         * Render the modal form
         * @method render
         * @protected
         * @chainable
         */
        mixin.render = function () {
            if(this.isClosed !== false) {
                this.once('submit', this.close);
            }
            return ModalView.prototype.render.apply(this, arguments);
        };

        return ModalView.extend(mixin);
    }
);
