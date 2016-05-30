/**
 * Indicator element
 * @param id
 * @constructor
 */
T.UI.Indicator = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Indicator.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Change connection indicator to offline status
 */
T.UI.Indicator.prototype.offline = function () {
    this.getElement().removeClass('online');
    this.getElement().addClass('offline');
};

/**
 * Change connection indicator to online status
 */
T.UI.Indicator.prototype.online = function () {
    this.getElement().removeClass('offline');
    this.getElement().addClass('online');
};