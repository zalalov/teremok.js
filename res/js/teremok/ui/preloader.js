/**
 * Preloader element
 * @param id
 * @constructor
 */
T.UI.Preloader = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Preloader.prototype = Object.create(T.UI.BasicElement.prototype);