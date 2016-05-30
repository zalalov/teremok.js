/**
 * Select boxes
 * @param el
 * @constructor
 */
T.UI.SelectBox = function (el) {
    var self = this;

    T.UI.Input.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        var el = this.getElement();
        var value;
        var voc = T.Vocabularies.getVocabulary();

        value = el.attr('value');

        if (value && value != voc.tWord('no_data')) {
            el.find('option[value=' + value + ']').attr('selected', 'selected');
        }
    };

    self.init();
};

T.UI.SelectBox.prototype = Object.create(T.UI.Input.prototype);

/**
 * Fill selectbox with options
 * @param data
 */
T.UI.SelectBox.prototype.fill = function (data) {
    var self = this;

    this.clear();

    $.each(data, function (key, value) {
        self.newOption(key, value);
    });
};

T.UI.SelectBox.prototype.newOption = function (value, text) {
    var option = $('<option>')
        .val(value)
        .text(text);

    this.getElement().append(option);
};

/**
 * Remove all options except static
 */
T.UI.SelectBox.prototype.clear = function () {
    this
        .getElement()
        .find('option')
        .not('.static')
        .remove();
};

/**
 * Resets selectbox's value to default
 */
T.UI.SelectBox.prototype.setDefaultValue = function () {
    var element = this.getElement();
    var defaultValue = element.find('option.' + T.Managers.ResourcesManager.DEFAULT_FORM_PARAM_VALUE_CLASS).attr('selected', 'selected');
};