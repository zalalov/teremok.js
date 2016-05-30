/**
 * List element
 * @param id
 * @constructor
 */
T.UI.List = function (el) {
    var self = this;

    self._type = el.attr('list_type');

    self.OFFSET = 100;

    T.UI.BasicElement.call(this, el);
};

T.UI.List.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Return length of cantaining items
 */
T.UI.List.prototype.items = function () {
    var listItems = this.getElement().find('.' + T.Managers.ResourcesManager.LIST_ITEM_CLASSNAME);
    var resList = new T.UI.ResourcesList(listItems);

    return resList;
};

/**
 * Clear list
 */
T.UI.List.prototype.clear = function () {
    this.removeEmptyMessage();
    this.removeListItems();
};

/**
 * Add 'load more' button to the list
 */
T.UI.List.prototype.addLoadMoreButton = function (listData) {
    var target = this.initLoadMoreButton(listData);
    T.Managers.ResourcesManager.parse(target);
};

/**
 * Remove 'load more' button from the list
 */
T.UI.List.prototype.removeLoadMoreButton = function () {
    var target = this.getElement().find('.' + T.Managers.ResourcesManager.LOAD_MORE_BUTTON_CLASS);

    if (target.length) {
        target.remove();
    }
};

/**
 * Init 'load more' button
 * @param action
 * @returns {*|jQuery}
 */
T.UI.List.prototype.initLoadMoreButton = function (listData) {
    var template, loadMoreButton, list, loadMethod, loadParams;

    template = $(T.Templates.getTemplate('load-more-button').html());
    list = this;
    loadMethod = listData['loadMethod'];
    loadParams = listData['params'];

    loadMoreButton = $(template).clone();
    list.getElement().append(loadMoreButton);

    loadParams['offset'] = list.getItemsCount();

    loadMoreButton
        .unbind('click')
        .click(function () {
            loadMethod(
                loadParams,
                function (response) {
                    T.Managers.DataManager.parse(response);
                    T.Managers.ListManager.fillList(listData);
                });
        });

    return loadMoreButton;
};

/**
 * Make current list as loadable
 * @param action
 */
T.UI.List.prototype.loadable = function (listData) {
    var itemsCount = this.getItemsCount();

    this.removeLoadMoreButton();

    if (itemsCount % this.OFFSET == 0 && itemsCount) {
        this.addLoadMoreButton(listData);
    }
};

/**
 * Find item in list by ID
 * @param itemId
 */
T.UI.List.prototype.findByItemId = function (itemId) {
    var item = this
        .getElement()
        .find('[' + T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE + '=' + itemId + ']')
        .filter('.' + T.Managers.ResourcesManager.LIST_ITEM_CLASSNAME)
        .not('.' + T.Managers.ResourcesManager.GROUP_LIST_ITEM_CLASSNAME);

    if (item.length) {
        return item;
    } else {
        return null;
    }
};

/**
 * Find group item in list by ID
 * @param itemId
 */
T.UI.List.prototype.findByGroupItemId = function (itemId) {
    var item = this
        .getElement()
        .find('[item_id=' + itemId + ']')
        .filter('.' + T.Managers.ResourcesManager.GROUP_LIST_ITEM_CLASSNAME);

    if (item.length) {
        return item;
    } else {
        return null;
    }
};

/**
 * Returns list's offset
 */
T.UI.List.prototype.getItemsCount = function () {
    var items = this.getElement().find('.' + T.Managers.ResourcesManager.LIST_ITEM_CLASSNAME);
    var itemsCount = items.size();

    return itemsCount;
};

/**
 * Removes all list items
 */
T.UI.List.prototype.removeListItems = function () {
    this.getElement()
        .find('.' + T.Managers.ResourcesManager.LIST_ITEM_CLASSNAME)
        .remove();
};

/**
 * Insert message that list is empty
 */
T.UI.List.prototype.insertEmptyMessage = function () {
    var message = T.Templates.getTemplate(T.Managers.ResourcesManager.EMPTY_LIST_MESSAGE_TEMPLATE_ID);

    this.append(message);
};

/**
 * Removes message that list is empty
 */
T.UI.List.prototype.removeEmptyMessage = function () {
    var message = this.getElement().find('.' + T.Managers.ResourcesManager.EMPTY_LIST_MESSAGE_CLASSNAME);

    message.remove();
};

/**
 * Returns checked list items
 */
T.UI.List.prototype.getCheckedItemsIds = function () {
    var result = [];
    var items = this.items();

    $.each(items, function (key, value) {
        var checkboxes = $(value).find('input[type=checkbox]');
        var itemId = $(value).attr(T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE)

        if (!checkboxes.length) {
            T.System.errorLog('T.UI.List.getCheckedItems: Item with id = ' + itemId + ' doen\'t contains checkbox!');
            return;
        } else {
            $.each(checkboxes, function (key, value) {
                if ($(value).is(':checked')) {
                    result.push(itemId);
                }
            });
        }
    });

    return result;
};