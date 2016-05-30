/**
 * Basic input element
 * @param id
 * @constructor
 */
T.UI.Input = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Input.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Mark field as error
 */
T.UI.Input.prototype.addError = function () {
    this.getElement().addClass('error');
};

/**
 * Remove error
 */
T.UI.Input.prototype.removeError = function () {
    this.getElement().removeClass('error');
};

/**
 * Set input default value
 */
T.UI.Input.prototype.setDefaultValue = function () {
    var inputElement = this.getElement();
    inputElement.val(inputElement.attr('default_value'));
};

/**
 * Check if field is empty
 */
T.UI.Input.prototype.isEmpty = function () {
    if (!this.getElement().val()) {
        return true;
    }

    return false;
};

/**
 * Returns / sets value
 */
T.UI.Input.prototype.val = function (value) {
    if (!value) {
        return this.getElement().val();
    }

    this.getElement().val(value);
};

/**
 * Add form-param class to be able to get value & send if by ajax
 */
T.UI.Input.prototype.formParam = function () {
    this.addClass(T.Managers.ResourcesManager.FORM_PARAM_CLASS);
};

/**
 * Removes form-param class. Element is not a form parameter any more
 */
T.UI.Input.prototype.disableFormParam = function () {
    this.removeClass(T.Managers.ResourcesManager.FORM_PARAM_CLASS);
};