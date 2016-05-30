/**
 * Pages
 * @param el
 * @constructor
 */
T.UI.Page = function (el) {
    var self = this;

    T.UI.Container.call(this, el);
};

T.UI.Page.prototype = Object.create(T.UI.Container.prototype);