/*globals _ */
// This javascript requires Underscore
/**
 * Construct a Spy object
 * @param object {object} Object whose property you wish to watch
 * @param property {string} Name of the property you wish to watch
 * @returns {Spy}
 * @constructor
 */
var Spy = function (object, property) {
    'use strict';
    if (!(this instanceof Spy)) { return new Spy(object, property); }
    if (_.isUndefined(object)) {
        return this;
    }
    return this.watch(object, property);
};
_.extend(Spy.prototype, {
    /**
     * @private
     */
    _calls: [],
    /**
     * Get the number of times that the
     * watched function has been called
     * @returns {number}
     */
    callCount: function () {
        'use strict';
        return this._calls.length;
    },
    /**
     * Returns true if the watched
     * function has been called
     * @returns {boolean}
     */
    called: function () {
        'use strict';
        return this._calls.length > 0;
    },
    /**
     * Limit how many times the function
     * can be called while being spied on.
     * Helps control infinite loops
     */
    callLimit: -1,
    /**
     * Empty the call history
     * @returns {Spy}
     */
    reset: function () {
        'use strict';
        this._calls = [];
        return this;
    },
    /**
     * Watch for calls to a given function
     *  Records passed arguments, and return values
     * @param object
     * @param property
     * @returns {Spy}
     */
    watch: function (object, property) {
        'use strict';
        if (!object) {
            throw new TypeError('Should watch property of object');
        }

        var wrappedMethod = object[property];

        if (!_.isFunction(wrappedMethod)) {
            throw new TypeError('Attempted to watch property that is not a function');
        }

        if (_.isFunction(wrappedMethod.restore) && wrappedMethod.restore.spy === true) {
            throw new TypeError('Attempted to watch ' + property + ' which is already being watched');
        }

        if (_.isFunction(this.restore)) {
            this.restore();
        }
        if (this.called()) {
            this.reset();
        }

        var owned = hasOwnProperty.call(object, property),
            method,
            that = this;
        object[property] = method = function () {
            if (that.callLimit >= 0 && that.count() > that.callLimit) {
                throw new Error('Call limit exceeded');
            }
            var ret, payload = {};
            payload.args = _.toArray(arguments);
            try {
                payload.returnValue = ret = wrappedMethod.apply(object, arguments);
            } catch (e) {
                payload.exception = e;
                throw e;
            } finally {
                that._calls.push(payload);
            }
            return ret;
        };

        method.restore = function () {
            if (!owned) {
                delete object[property];
            }
            if (object[property] === method) {
                object[property] = wrappedMethod;
            }
        };
        method.restore.spy = true;

        return this;
    }
});
