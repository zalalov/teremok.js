/**
 * Containers
 * @param id
 * @constructor
 */
T.UI.Container = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);
};

T.UI.Container.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Inserting template into container
 * @param template
 */
T.UI.Container.prototype.insert = function (insertData) {
    var stateName, stateType;
    var template = insertData['template'];
    var element;

    if (template instanceof T.UI.BasicElement) {
        stateName = template.getResourceId();
        stateType = template.getResourceType();

        if (template instanceof T.UI.FullInfoPage) {
            stateName = template.getDatatype() + 's/' + template.getItemId();
        }

        template = template.html();
    } else
        if (template instanceof jQuery) {
            var element = template
                .find('[' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=' + T.Managers.ResourcesManager.PAGE_TYPE + ']');

            stateName = element.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE);
            stateType = element.attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE);
        } else
        if (typeof template == 'string') {
            template = $(template);
            stateName = template.attr('id');
        } else {
            T.System.errorLog('T.UI.Container.insert: Can\'t parse state name!');
            stateName = 'Unknown state';
        }

    if (!insertData['hide']) {
        this.getElement()
            .html(template);
    } else {
        this.hideContent();
        this.getElement().append(template);
    }

    T.Managers.ResourcesManager.parse(template);

    if (insertData['newState']) {
        var stateData = {
            stateName : stateName,
            stateType : stateType
        };

        T.System.History.newState(stateData);
    }
};

/**
 * Get preloader of current container
 * @returns {*|first|first}
 */
T.UI.Container.prototype.getPreloader = function () {
    var preloader = this.findByType('preloader');
    return preloader.first();
};

/**
 * Setting sizes of image
 */
T.UI.Container.prototype.setSizes = function () {
    var element = this.getElement();
    var width = element.width();
    var height = element.height();
    var resultWidth, resultHeight;

    if (height > 0) {
        resultWidth = height * 1.2;
        element.width(resultWidth);
    } else {
        if (width > 0) {
            resultHeight = width * 0.83;
            element.height(resultHeight);
        }
    }

    element.parent().width(resultWidth).height(resultHeight);
};

/**
 * Hide all content in current container
 */
T.UI.Container.prototype.hideContent = function () {
    this.getElement().children().hide();
};

/**
 * Hide all content in current container
 */
T.UI.Container.prototype.showContent = function () {
    this.getElement()
        .children()
        .show();
};

/**
 * Removes full info page
 */
T.UI.Container.prototype.removeFullInfoPage = function () {
    this.getElement()
        .find('[' + T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE + '=' + T.Managers.ResourcesManager.FULL_INFO_PAGE_TYPE + ']')
        .remove();
};

/**
 * Removes full info template & shows list
 */
T.UI.Container.prototype.leaveFullInfoPage = function () {
    this.removeFullInfoPage();
    this.showContent();
};