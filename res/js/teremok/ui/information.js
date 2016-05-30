/**
 * Elements with data
 * @param id
 * @constructor
 */
T.UI.Information = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Information.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Set value of information block
 * @param value
 * @returns {Information}
 */
T.UI.Information.prototype.setValue = function (value) {
    var voc = T.Vocabularies.getVocabulary();
    var element = this.getElement();

    if (!value) {
        element.find('.value').text(voc.tWord('no_data'));
    } else {
        if (!value.length) {
            element.find('.value').text(voc.tWord('no_data'));
        } else {
            element.find('.value').text(value);
        }
    }

    return this;
};

/**
 * Set value with currency
 * @param value
 */
T.UI.Information.prototype.setMoneyValue = function (value) {
    var voc = T.Vocabularies.getVocabulary();

    this.setValue(value + ' ' + voc.tWord('rubles').toLowerCase());
};