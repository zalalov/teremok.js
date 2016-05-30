/**
 * Hooks for js objects
 */
T.Hooks = new function () {
    /**
     * Defines watcher that follow the js object
     */
    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop, handler) {
                var oldval = this[prop];
                var newval = oldval;

                var getter = function () {
                    return newval;
                };

                var setter = function (val) {
                    oldval = newval;
                    newval = val;
                    handler.call(this, prop, oldval, newval);
                };

                if (delete this[prop]) {
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        });
    }

    /**
     * Unwatcher
     */
    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false,
            configurable: true,
            writable: false,
            value: function (prop) {
                var val = this[prop];
                delete this[prop];
                this[prop] = val;
            }
        });
    }
};