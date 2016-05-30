/**
 * Radio inputs
 * @param el
 * @constructor
 */
T.UI.Radio = function (el) {
    var self = this;

    T.UI.Input.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        var value = this.getElement().attr('value');

        if (value) {
            this.setValue(value);
        }
    };

    self.init();
};

T.UI.Radio.prototype = Object.create(T.UI.Input.prototype);

/**
 * Get value of radio
 */
T.UI.Radio.prototype.val = function () {
    return this.getElement().find('input:checked').val();
};

/**
 * Add error to radio
 */
T.UI.Radio.prototype.addError = function () {
    var inputs = this.getElement().find('input[type=radio]');

    $.each(inputs, function (key, value) {
        $(value).addClass('error');
    });
};

/**
 * Remove error from radio
 */
T.UI.Radio.prototype.removeError = function () {
    var inputs = this.getElement().find('input[type=radio]');

    $.each(inputs, function (key, value) {
        $(value).removeClass('error');
    });
};

/**
 * Check if radio is empty
 */
T.UI.Radio.prototype.isEmpty = function () {
    var checked = this.getElement().find('input:checked');

    if (!checked.length) {
        return true;
    }

    return false;
};

/**
 * Sets resource value
 */
T.UI.Radio.prototype.setValue = function (value) {
    this.getElement()
        .find('input[value=' + value + ']')
        .prop('checked', true);
};