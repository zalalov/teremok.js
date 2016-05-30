/**
 * Basic ui element
 */
T.UI.BasicElement = function (el) {
    var self = this;

    self._id = el.attr(T.Managers.ResourcesManager.ID_ATTRIBUTE);

    if (el.attr('class')) {
        self._classes = el.attr('class').split(' ');
    }

    self._resourceId = el.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE);
    self._resourceType = el.attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE);
    self._tag = el.prop('tagName');
    self._type = el.attr(T.Managers.ResourcesManager.TYPE_ATTRIBUTE);
    self._dataType = el.attr(T.Managers.ResourcesManager.DATATYPE_ATTRIBUTE);
    self._defaultValue = el.attr(T.Managers.ResourcesManager.DEFAULT_VALUE_ATTRIBUTE);
    self._mask = el.attr(T.Managers.ResourcesManager.MASK_ATTRIBUTE);

    self._filter = self._tag + '[' + T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE + '=' + self._resourceId + '][' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=' + self._resourceType + ']';

    /**
     * If element's template has smth like this '#hole#'
     * it will be filled and contained in this variable
     * .html() method will return this._inner
     * @type {null}
     * @private
     */
    self._inner = null;

    /**
     * Template for elements which containes smth like this '#hole#'
     * template with #hole# values will be saved in this variable
     * @type {*}
     * @private
     */
    self._template = el;

    this.watch('_resourceId',this.updateFilter);
    this.watch('_resourceType',this.updateFilter);
};

/**
 * Get element of current resource
 * @returns {$|*|jQuery|HTMLElement}
 */
T.UI.BasicElement.prototype.getElement = function () {
    if (this._filter) {
        return $(this._filter);
    }

    return $(this._id);
};

/**
 * Find resource by id inside current resource
 * @param resourceId
 * @returns {*}
 */
T.UI.BasicElement.prototype.find = function (resourceId) {
    var result = this.getElement().find('[' + T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE + '=' + resourceId + ']');

    if (!result.length) {
        T.System.errorLog('There\'s no resource with id: ' + resourceId + ' in container with id: ' + this.getResourceId() + '!');
        return null;
    }

    return T.Managers.ResourcesManager.get(result.attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE), result.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE));
};

/**
 * Find resource by type inside current resource
 * @param resourceType
 * @returns {*}
 */
T.UI.BasicElement.prototype.findByType = function (resourceType) {
    var $result = this.getElement().find('[' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=' + resourceType + ']');
    var result = {};

    if (!$result.length) {
        T.System.errorLog('There\'s no resource with type:' + resourceType + '!');
        return null;
    }

    result = new T.UI.ResourcesList();

    $result.each(function (key, value) {
        result.add(T.Managers.ResourcesManager.get($(value).attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE), $(value).attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE)));
    });

    return result;
};

/**
 * Find resource by custom filter inside current resource
 * @param data
 * @returns {*}
 */
T.UI.BasicElement.prototype.findByCustomFilter = function (data) {
    var filter = '';
    var $result, result;

    $.each(data, function (key, value) {
        filter += '[' + key + '=' + value + ']';
    });

    $result = this.getElement().find(filter);

    if (!$result.length) {
        T.System.errorLog('There\'s no resource with type:' + resourceType + '!');
        return null;
    }

    result = new T.UI.ResourcesList();

    $result.each(function (key, value) {
        result.add(T.Managers.ResourcesManager.get($(value).attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE), $(value).attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE)));
    });

    return result;
};

/**
 * Find closest container
 */
T.UI.BasicElement.prototype.getContainer = function () {
    var container = this.getElement().closest('[' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=container]');
    var containerRes = T.Managers.ResourcesManager.get(container.attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE), container.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE));

    if (containerRes) {
        return containerRes;
    } else {
        return null;
    }
};

/**
 * Get resource's resource type
 * @returns {*}
 */
T.UI.BasicElement.prototype.getResourceType = function () {
    return this._resourceType;
};

/**
 * Get resource's resource id
 * @returns {*}
 */
T.UI.BasicElement.prototype.getResourceId = function () {
    return this._resourceId;
};

/**
 * Get resource's default value attribute value
 * @returns {*}
 */
T.UI.BasicElement.prototype.getDefaultValue = function () {
    return this._defaultValue;
};

/**
 * Get resource's type attribute value
 * @returns {*}
 */
T.UI.BasicElement.prototype.getType = function () {
    return this._type;
};

/**
 * Get resource's id attribute value
 * @returns {*}
 */
T.UI.BasicElement.prototype.getId = function () {
    return this._id;
};

/**
 * Hook. Updates resource's filter. Need when element change attribute's value dynamically
 * @param prop
 * @param oldVal
 * @param newVal
 */
T.UI.BasicElement.prototype.updateFilter = function (prop, oldVal, newVal) {
    this._filter = this._tag + '[' + T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE + '=' + this._resourceId + '][' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=' + this._resourceType + ']';
};

/**
 * Set resource's resource id
 * @param id
 */
T.UI.BasicElement.prototype.setResourceId = function (id) {
    if (!id) {
        T.System.errorLog('T.UI.BasicElement.setResourceId: Param invalid: id');
        return;
    }

    this._resourceId = id;
};

/**
 * Check if resource has class 'className'
 * @param className
 */
T.UI.BasicElement.prototype.hasClass = function (className) {
    if (!className) {
        T.System.errorLog('T.UI.BasicElement.hasClass: Param invalid: className');
        return null;
    }

    if (this._classes.indexOf(className) > -1) {
        return true;
    }

    return false;
};

/**
 * Hide DOM element
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.hide = function () {
    this.getElement().addClass('hidden');
    return this;
};

/**
 * Show DOM element
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.show = function () {
    this.getElement().removeClass('hidden');
    return this;
};

/**
 * Set DOM element as invisible
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.invisible = function () {
    this.getElement().addClass('invisible');
    return this;
};

/**
 * Set DOM element as visible
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.visible = function () {
    this.getElement().removeClass('invisible');
    return this;
};

/**
 * Disable DOM element
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.disable = function () {
    this.getElement().attr('disabled', 'disabled');
    return this;
};

/**
 * Enable DOM element
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.enable = function () {
    this.getElement().removeAttr('disabled');
    return this;
};

/**
 * Set DOM element as 'selected'
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.setSelected = function () {
    this.getElement().addClass('selected');
    return this;
};

/**
 * Remove selection
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.removeSelection = function () {
    this.getElement().removeSelection('selected');
    return this;
};

/**
 * Setting element's text value
 * @param text
 * @returns {BasicElement}
 */
T.UI.BasicElement.prototype.setText = function (text) {
    this.getElement().text(text);
    return this;
};

/**
 * Click event setting
 * @param callback
 */
T.UI.BasicElement.prototype.click = function (callback) {
    var currentElement = this.getElement();

    currentElement.unbind('click');
    currentElement.click(function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * Keypress event setting
 * @param callback
 */
T.UI.BasicElement.prototype.keypress = function (callback) {
    var currentElement = this.getElement();

    currentElement.unbind('keypress');
    currentElement.keypress(function (e) {
        if (callback) {
            callback(e);
        }
    });
};

/**
 * Trigger some action
 * @param callback
 */
T.UI.BasicElement.prototype.trigger = function (callback) {
    this.getElement().trigger(callback);
};

/**
 * Change event setting
 * @param callback
 */
T.UI.BasicElement.prototype.change = function (callback) {
    var currentElement = this.getElement();

    currentElement.unbind('change');
    currentElement.change(function (e) {
        if (callback) {
            callback(e);
        }
    });
};

/**
 * Fill list item with data
 * @param data
 * @returns {$|*|jQuery|HTMLElement}
 */
T.UI.BasicElement.prototype.fill = function (data) {
    var template = this._template.prop('outerHTML');
    var voc = T.Vocabularies.getVocabulary();
    var regExp = /#[a-zA-Z_\/-]+#/;
    var value, key;
    var data = data;

    if (data) {
        data['role_name'] = T.System.Router.getControllerName();

        while (value = template.match(regExp)) {
            value = value[0];
            key = value.replace(/#/g, '');

            if (data[key] != undefined || data[key] != null) {
                template = template.replace(value, data[key]);
            } else {
                template = template.replace(value, voc.tWord('no_data'));
            }
        }
    }

    template = $(template);
    this.setInner(template);

    if (template.attr(T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE)) {
        this.setItemId(template.attr(T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE));
    }
};

/**
 * Add class to element
 * @param className
 */
T.UI.BasicElement.prototype.addClass = function (className) {
    this.getElement().addClass(className);
    this._classes.push(className);
};

/**
 * Remvoe class from element
 * @param className
 */
T.UI.BasicElement.prototype.removeClass = function (className) {
    var classIndex;

    this.getElement().removeClass(className);

    classIndex = this._classes.indexOf(className);
    this._classes.splice(classIndex, 1);
};

/**
 * Sets element's inner if object creates dynamic
 * @param inner
 */
T.UI.BasicElement.prototype.setInner = function (inner) {
    this._inner = inner;

    if (this._inner.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE)) {
        this.setResourceId(this._inner.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE));
    }

    if (this._inner.attr(T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE)) {
        this.setItemId(this._inner.attr(T.Managers.ResourcesManager.ITEM_ID_ATTRIBUTE));
    }
};

/**
 * Returns inner html
 */
T.UI.BasicElement.prototype.html = function () {
    return this._inner;
};

/**
 * Returns datatype attribute value
 */
T.UI.BasicElement.prototype.getDatatype = function () {
    return this._dataType;
};

/**
 * Returns resource's item_id attribute value
 */
T.UI.BasicElement.prototype.getItemId = function () {
    return this._itemId;
};

/**
 * Set list item's item id
 * @param id
 */
T.UI.BasicElement.prototype.setItemId = function (id) {
    if (!id) {
        T.System.errorLog('T.UI.BasicElement.setItemId: Param invalid: id');
        return;
    }

    this._itemId = id;
};

/**
 * Returns mask attribute value
 */
T.UI.BasicElement.prototype.getMask = function () {
    return this.getElement().attr(T.Managers.ResourcesManager.MASK_ATTRIBUTE);
};

/**
 * Add item to the end of the element
 * @param item
 */
T.UI.BasicElement.prototype.append = function (item) {
    if (!item) {
        T.System.errorLog('T.UI.BasicElement: Param invalid: item');
    }

    this.getElement().append(item.html());
};

/**
 * Add item to the element's beginning
 * @param item
 */
T.UI.BasicElement.prototype.prepend = function (item) {
    if (!item) {
        T.System.errorLog('T.UI.BasicElement: Param invalid: item');
    }

    this.getElement().prepend(item.html());
};

/**
 * Removes element
 */
T.UI.BasicElement.prototype.remove = function () {
    this.getElement().remove();
};