/**
 * Index element (index in the right top corner of parent element)
 * @param id
 * @constructor
 */
T.UI.Index = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

/**
 * Inheritance from BasicElement
 * @type {prototype|*}
 */
T.UI.Index.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Set index value
 */
T.UI.Index.prototype.setIndex = function (index) {
    this.getElement().text(index);
};