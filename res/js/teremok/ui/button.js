/**
 * Basic button element
 * @param id
 * @constructor
 */
T.UI.Button = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Button.prototype = Object.create(T.UI.BasicElement.prototype);