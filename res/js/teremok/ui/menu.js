/**
 * Basic menu
 * @param id
 * @constructor
 */
T.UI.Menu = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Menu.prototype = Object.create(T.UI.BasicElement.prototype);