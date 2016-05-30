/**
 * Line element
 * @param id
 * @constructor
 */
T.UI.Line = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Line.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Set line value
 * @param value
 */
T.UI.Line.prototype.setValue = function (value) {
    var element = this.getElement();

    element.find('.progress_bar').css({ width : value + '%'});
    element.find('.line_value').text(value + ' %');
};