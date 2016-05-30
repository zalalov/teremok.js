/**
 * Resources managers
 */

T.Managers.ResourcesManager = new function () {
    var self = this;

    self._resources = null;
    self._typeClasses = null;

    self.RESOURCE_TYPE_ATTRIBUTE    = 'resource_type';
    self.RESOURCE_ID_ATTRIBUTE      = 'resource_id';
    self.ITEM_ID_ATTRIBUTE          = 'item_id';
    self.ID_ATTRIBUTE               = 'id';
    self.TYPE_ATTRIBUTE             = 'type';
    self.DATATYPE_ATTRIBUTE         = 'datatype';
    self.MASK_ATTRIBUTE             = 'mask';
    self.DEFAULT_VALUE_ATTRIBUTE    = 'default_value';

    /**
     * UI types
     * @type {string}
     */
    self.BUTTON_TYPE            = 'button';
    self.INPUT_TYPE             = 'input';
    self.IMAGE_TYPE             = 'image';
    self.PRELOADER_TYPE         = 'preloader';
    self.INDICATOR_TYPE         = 'indicator';
    self.PREVIEW_TYPE           = 'preview';
    self.CONTAINER_TYPE         = 'container';
    self.MAIN_CONTAINER_TYPE    = 'main-container';
    self.LINK_TYPE              = 'link';
    self.INFORMATION_TYPE       = 'information';
    self.DIALOG_TYPE            = 'dialog';
    self.SOUND_TYPE             = 'sound';
    self.INDEX_TYPE             = 'index';
    self.LINE_TYPE              = 'line';
    self.MENU_TYPE              = 'menu';
    self.MAIN_MENU_TYPE         = 'main-menu';
    self.LIST_TYPE              = 'list';
    self.LIST_ITEM_TYPE         = 'list-item';
    self.FULL_INFO_PAGE_TYPE    = 'full-info-page';
    self.SELECT_BOX_TYPE        = 'select-box';
    self.FORM_TYPE              = 'form';
    self.DATE_TYPE              = 'date';
    self.PAGE_TYPE              = 'page';
    self.CHECKBOX_TYPE          = 'checkbox';
    self.RADIO_TYPE             = 'radio';
    self.MULTY_CHECKBOX_TYPE    = 'multi-checkbox';
    self.GRAPH_TYPE             = 'graph';

    /**
     * CSS CLASSES & ATTRIBUTES
     */

    // Buttons & links
    self.EXIT_LINK_CLASS                = 'exit-link';
    self.LOAD_MORE_BUTTON_CLASS         = 'load-more-button';
    self.BACK_TO_LIST_CLASS             = 'back-to-list';

    // Class name for images, which must build from attributes data
    self.BUILD_REQUIRED_CLASS           = 'build-required';
    self.LOGO_IMAGE_ID                  = 'logo_image';

    // Lists
    self.LIST_ITEM_CLASSNAME            = 'list-item';
    self.GROUP_LIST_ITEM_CLASSNAME      = 'group-list-item';
    self.CLICKABLE_ITEM_CLASS           = 'clickable';
    self.EMPTY_LIST_MESSAGE_TEMPLATE_ID = 'empty-list-message';
    self.EMPTY_LIST_MESSAGE_CLASSNAME   = 'empty-list-message';


    // Filters
    self.FORM_PARAM_CLASS               = 'form-param';
    self.DEFAULT_FORM_PARAM_VALUE_CLASS = 'default_value';
    self.FORM_PARAM_NAME_ATTR           = 'form_param_name';
    self.FORM_PARAM_VALUE_ATTR          = 'form_param_value';
    self.NOT_EMPTY_FIELD_CLASS          = 'not-empty'

    // Previews
    self.OPEN_DIALOG_CLASS              = 'open-dialog';

    // Dialogs
    self.NEW_ORDER_DIALOG               = 'new_order_dialog';
    self.CONNECTION_LOST_DIALOG         = 'connection_lost_dialog';
    self.PARTLY_SATISFY_DIALOG          = 'partly_satisfy_dialog';
    self.SATISFY_DIALOG                 = 'satisfy_dialog';
    self.PHOTO_DIALOG                   = 'photo_dialog';
    self.DENY_DIALOG                    = 'deny_dialog';

    self.VIEW_PHOTOS_DIALOG_ID          = 'view_photos_dialog';
    self.ROTATE_LEFT_BUTTON_ID          = 'rotate_left';
    self.ROTATE_RIGHT_BUTTON_ID         = 'rotate_right';
    self.MODAL_PHOTO_ID                 = 'modal_photo';
    self.ALERT_MESSAGE_CLASS            = 'message';
    self.AUTO_HIDE_DIALOG_ATTRIBUTE     = 'auto-hide'

    /**
     * Initing resource manager
     */
    self.init = function () {
        /**
         * Object for every UI element
         * @type {{}}
         * @private
         */
        self._resources = {};
        self._typeClasses = {};

        /**
         * Every type to empty resource object & corresponding types to UI classes
         */
        $.each(self, function (key, value) {
            if (key.slice(-4) == 'TYPE') {
                self._resources[value] = {};
                self._typeClasses[value] = T.UI[T.Utils.toCamelCaseClass(value)];
            }
        });
    };

    /**
     * Parses dom to resources
     * @param response
     */
    self.parse = function (response) {
        var resources;
        var template_name;

        if (!response) {
            resources = $('*');
        } else {
            resources = $(response);
        }

        resources = resources.find('.resource');

        resources.each(function (key, element) {
            var el = $(element);
            var resource;
            var type = el.attr(self.RESOURCE_TYPE_ATTRIBUTE);
            var id = el.attr(self.RESOURCE_ID_ATTRIBUTE);

            if (self._resources[type]) {
                self._resources[type][id] = new self._typeClasses[type](el);
                resource = self._resources[type][id];
            } else {
                T.System.errorLog("There's no resource type: " + type);
                T.System.log('Error element: ', el);
            }
        });
    };

    /**
     * Get resource by type & id
     * @param type
     * @param id
     */
    self.get = function (type, id) {
        if (!self._resources[type]) {
            return null;
        }

        return self._resources[type][id];
    };

    /**
     * Get resource of jquery element
     * @param el
     */
    self.getElementResource = function (el) {
        if (el instanceof jQuery) {
            var resType = el.attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE);
            var resId = el.attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE);

            return T.Managers.ResourcesManager.get(resType,resId);
        } else {
            T.System.errorLog('T.Managers.ResourcesManager.getElementResource: Is not a jQuery element!');
            return undefined;
        }
    };

    /**
     * Returns resources tree
     * @returns {null|*}
     */
    self.getResourcesTree = function () {
        return self._resources;
    };

    /**
     * Returns view-photos dialog resource
     */
    self.getViewPhotosDialog = function () {
        return self._resources[self.DIALOG_TYPE][self.VIEW_PHOTOS_DIALOG_ID];
    };

    /**
     * Returns current full info page resource
     */
    self.getCurrentFullInfoPage = function () {
        var body = self.get(self.CONTAINER_TYPE, 'body');
        var fip = body.getElement().find('[' + self.RESOURCE_TYPE_ATTRIBUTE + '=' + self.FULL_INFO_PAGE_TYPE +']');
        var fipRes = null;

        if (fip.length) {
            fipRes = self.getElementResource(fip);
        }

        return fipRes;

    };

    /**
     * Returns page container
     * @returns {*}
     */
    self.getPageContainer = function () {
        return self.get(self.CONTAINER_TYPE, 'page_container');
    };
};