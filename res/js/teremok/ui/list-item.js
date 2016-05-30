/**
 * List item
 * @param id
 * @constructor
 */
T.UI.ListItem = function (el) {
    var self = this;

    self._itemId = null;
    self._dataType = null;

    T.UI.BasicElement.call(this, el);

    this.watch('_itemId', this.updateFilter);
};

T.UI.ListItem.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Check checkbox in the list-item
 */
T.UI.ListItem.prototype.check = function () {
    var checkbox = this.getElement().find('input[type=checkbox]');

    if (!checkbox.length) {
        T.System.errorLog('T.UI.ListItem.check: Current list item doesn\'t contains checkbox');
        return;
    }

    checkbox.attr('checked', 'checked');
};

/**
 * Return true if checkbox in list item checked & false if not
 */
T.UI.ListItem.prototype.isChecked = function () {
    var checkbox = this.getElement().find('input[type=checkbox]');

    if (!checkbox.length) {
        T.System.errorLog('T.UI.ListItem.isChecked: Current list item doesn\'t contains checkbox');
        return;
    }

    return checkbox.is(':checked');
};

/**
 * Checking checkbox inside the list item event
 */
T.UI.ListItem.prototype.oncheck = function (callback) {
    var checkbox = this.getElement().find('input[type=checkbox]');

    if (!checkbox.length) {
        T.System.errorLog('T.UI.ListItem.isChecked: Current list item doesn\'t contains checkbox');
        return;
    }

    checkbox.change(function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * On item's edit button click
 * @param callback
 */
T.UI.ListItem.prototype.editButtonClick = function (callback) {
    this.getElement()
        .find('.edit-button')
        .click(function () {
            if (callback()) {
                callback();
            }
        });
};

/**
 * Returns list item's value
 * @returns {*}
 */
T.UI.ListItem.prototype.getValue = function () {
    return this.getElement().attr('value');
};