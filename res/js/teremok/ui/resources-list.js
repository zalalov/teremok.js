/**
 * List of resources
 * @param id
 * @constructor
 */
T.UI.ResourcesList = function (data) {
    var self = this;

    self._list = {};

    if (data) {
        self.fillList(data);
    }
};

/**
 * Add resource to resources list
 * @param res
 */
T.UI.ResourcesList.prototype.add = function (res) {
    var id = res.getResourceId();
    this._list[id] = res;
};

/**
 * Get resource by id
 * @param id
 * @returns {*}
 */
T.UI.ResourcesList.prototype.get = function (id) {
    return this._list[id];
};

/**
 * Get first element of resources list
 * @param id
 * @returns {*}
 */
T.UI.ResourcesList.prototype.first = function (id) {
    return this._list[Object.keys(this._list)[0]];
};

/**
 * Fill resources list
 * @param data
 */
T.UI.ResourcesList.prototype.fillList = function (data) {
    var self = this;
    var id;

    $.each(data, function (key, value) {
        if (value instanceof T.UI.BasicElement) {
            self.add(value);
        } else if (value instanceof jQuery) {
            id = $(value).attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE);
            self._list[id] = $(value);
        }
    });
};

/**
 * Apply show() to all resources list elements
 */
T.UI.ResourcesList.prototype.show = function () {
    $.each(this._list, function (key, resource) {
        resource.show();
    });
};

/**
 * Bind click event to all elements
 * @param callback
 */
T.UI.ResourcesList.prototype.click = function (callback) {
    $.each(this._list, function (key, resource) {
        resource.click(function () {
            if (callback) {
                callback(resource);
            }
        });
    });
};

/**
 * Bind change event to all elements
 * @param callback
 */
T.UI.ResourcesList.prototype.change = function (callback) {
    $.each(this._list, function (key, resource) {
        resource.change(function () {
            if (callback) {
                callback(resource);
            }
        });
    });
};

/**
 * Get length of resources list
 * @returns {Number}
 */
T.UI.ResourcesList.prototype.length = function () {
    return Object.keys(this._list).length;
};