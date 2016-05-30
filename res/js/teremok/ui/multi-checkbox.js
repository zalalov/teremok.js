/**
 * Elements with several checkboxes (value will be an array)
 * @param el
 * @constructor
 */
T.UI.MultiCheckbox = function (el) {
    var self = this;

    T.UI.Input.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        var value = this.getElement().attr('value');
        var valuesArr, el;
        var voc = T.Vocabularies.getVocabulary();

        if (value && value != voc.tWord('no_data')) {
            valuesArr = value.split(', ');

            $.each(valuesArr, function (key, value) {
                el = self.getElement().find('input[value=' + value + ']');

                if (el.length) {
                    el.prop('checked', true);
                }
            });
        }
    };

    self.init();
};

T.UI.MultiCheckbox.prototype = Object.create(T.UI.Input.prototype);

/**
 * Returns value of multi-checkbox
 * @returns {Array}
 */
T.UI.MultiCheckbox.prototype.val = function () {
    var checkedElements = this.getElement().find('input:checked');
    var values = [];

    $.each(checkedElements, function (key, value) {
        values.push($(value).val());
    });

    return values;
};

/**
 * Check if empty
 */
T.UI.MultiCheckbox.isEmpty = function () {
    var checkedElements = this.getElement().find('input:checked');

    if (!checkedElements.length) {
        return true;
    }

    return false;
};

/**
 * Add error to multi-checkbox
 */
T.UI.MultiCheckbox.prototype.addError = function () {
    var inputs = this.getElement().find('input[type=radio]');

    $.each(inputs, function (key, value) {
        $(value).addClass('error');
    });
};

/**
 * Remove error from multi-checkbox
 */
T.UI.MultiCheckbox.prototype.removeError = function () {
    var inputs = this.getElement().find('input[type=checkbox]');

    $.each(inputs, function (key, value) {
        $(value).removeClass('error');
    });
};