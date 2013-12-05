define(
    ['core/js/modal/modalView', 'core/js/forms/form'],
    function (ModalView, Form) {
        'use strict';
        // Borrow viewOptions, and methods from forms/form.js
        var viewOptions = ['validate'],
            mixin = _.pick(Form.prototype, ['submit', 'serializeForm', 'isValid', '_validate']);

        mixin.constructor = function (options) {
            if (_.isObject(options)) {
                _.extend(this, _.pick(options, viewOptions));
            }
            ModalView.prototype.constructor.apply(this, arguments);

            return this;
        };

        mixin.events = _.extend(
            _.result(ModalView.prototype, 'events'),
            _.result(Form.prototype, 'events')
        );

        mixin.render = function () {
            if(this.isClosed !== false) {
                this.once('submit', this.close);
            }
            return ModalView.prototype.render.apply(this, arguments);
        };

        return ModalView.extend(mixin);
    }
);
