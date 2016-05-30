/**
 * Lists manager
 * Manage all teremok's lists
 */
T.Managers.ListManager = new function () {
    var self = this;

    self.POINTS_LIST_TYPE       = 'points';
    self.USERS_LIST_TYPE        = 'users';
    self.CLIENTS_LIST_TYPE      = 'clients';
    self.ORDERS_LIST_TYPE       = 'orders';
    self.TARIFFS_LIST_TYPE      = 'tariffs';
    self.RELEASE_NOTES_LIST     = 'release_notes';
    self.MESSAGES_LIST_TYPE     = 'messages';
    self.ORDER_OPERATIONS_LIST  = 'order_operations';
    self.POINT_TARIFFS_LIST     = 'point_tariffs';
    self.POINT_GROUPS_LIST      = 'point_groups';
    self.POINT_USERS_LIST       = 'point_users';
    self.USER_ROLES_LIST        = 'user_roles';
    self.USER_POINTS_LIST       = 'user_points';

    /**
     * Make new list
     * @param type
     * @param data
     */
    self.fillList = function (listData) {
        var template, pointItem, list, resType, type;

        type = listData['type'];
        list = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LIST_TYPE, type + '_list');

        if (listData['clear']) {
            list.clear();
        }

        switch (type) {
            case self.POINTS_LIST_TYPE:
                self.makePointsList(list, listData);
                break;
            case self.USERS_LIST_TYPE:
                var users = T.Managers.DataManager.getUsers();
                self.addItems(self.USERS_LIST_TYPE, list, users, listData);
                break;
            case self.ORDERS_LIST_TYPE:
                var orders = T.Managers.DataManager.getOrders();
                self.addItems(self.ORDERS_LIST_TYPE, list, orders, listData);
                break;
            case self.CLIENTS_LIST_TYPE:
                var clients = T.Managers.DataManager.getClients();
                self.addItems(self.CLIENTS_LIST_TYPE, list, clients, listData);
                break;
            case self.TARIFFS_LIST_TYPE:
                var tariffs = T.Managers.DataManager.getTariffs();
                self.addItems(self.TARIFFS_LIST_TYPE, list, tariffs, listData);
                break;
            case self.RELEASE_NOTES_LIST:
                var rNotes = T.Managers.DataManager.getReleaseNotes();
                self.addItems(self.RELEASE_NOTES_LIST, list, rNotes, listData);
                break;
            case self.MESSAGES_LIST_TYPE:
                var messages = T.Managers.DataManager.getMessages();
                self.addItems(self.MESSAGES_LIST_TYPE, list, messages, listData);
                break;
            case self.ORDER_OPERATIONS_LIST:
                var orderId = listData['parent_id'];
                var operations = T.Managers.DataManager.getOrderOperations(orderId);
                var availibleStatuses = [
                    T.Models.Transaction.TYPE_INTEREST,
                    T.Models.Transaction.TYPE_PENALTY,
                    T.Models.Transaction.TYPE_PRINCIPAL_REPAYMENT,
                    T.Models.Transaction.TYPE_INTEREST_REPAYMENT,
                    T.Models.Transaction.TYPE_PENALTY_REPAYMENT
                ];

                operations = T.Managers.DataManager.filterDataValuesByProp(operations, 'type', availibleStatuses);

                self.addItems(self.ORDER_OPERATIONS_LIST, list, operations, listData);
                break;
            case self.POINT_TARIFFS_LIST:
                var pointId = listData['parent_id'];
                var tariffs = T.Managers.DataManager.getTariffs();

                self.addItems(self.POINT_TARIFFS_LIST, list, tariffs, listData);
                break;
            case self.POINT_GROUPS_LIST:
                var groups = T.Managers.DataManager.getPointsGroups();

                self.addItems(self.POINT_GROUPS_LIST, list, groups, listData);
                break;
            case self.POINT_USERS_LIST:
                var pointId = listData['parent_id'];
                var users = T.Managers.DataManager.getUsers();
                var pointUsers = T.Managers.DataManager.filterDataValuesByProp(users, 'is_binded', ['1', '0']);
                var bindedUsers = T.Managers.DataManager.filterDataValuesByProp(pointUsers, 'is_binded', ['1']);

                listData['checked_values'] = T.Utils.getPropValues(bindedUsers['values'], 'id');

                self.addItems(self.POINT_USERS_LIST, list, pointUsers, listData);
                break;
            case self.USER_ROLES_LIST:
                var user = listData['parent_id'];
                var roles = listData['bindable_roles'];

                self.addItems(self.USER_ROLES_LIST, list, roles, listData);
                break;
            case self.USER_POINTS_LIST:
                var user = listData['parent_id'];
                var points = T.Managers.DataManager.getPoints();
                var bindedPoints = T.Managers.DataManager.filterDataValuesByProp(points, 'is_binded', ['1']);

                listData['checked_values'] = T.Utils.getPropValues(bindedPoints['values'], 'id');

                self.addItems(self.USER_POINTS_LIST, list, points, listData);
                break;
            default:
                T.System.errorLog('T.Managers.ListManager: Param invalid: type');
                break;
        }
    };

    /**
     * Get template of item's full info page
     * @param page
     */
    self.getFullInfoTemplate = function (page) {
        return T.Templates.getTemplate(page + '-item-full-info');
    };

    /**
     * Make points list
     * @param points
     */
    self.makePointsList = function (list, listData) {
        var self = this;
        var pointTemplate, groupTemplate, groups;
        var pointItem, groupItem;
        var clickEventHandler, checkEventHandler, clickCallback, editButtonHandler;
        var itemData, group;

        groups = T.Managers.DataManager.getPointsGroups();
        pointTemplate = T.Templates.getTemplate(self.POINTS_LIST_TYPE + '-list-item');
        groupTemplate = T.Templates.getTemplate(self.POINTS_LIST_TYPE + '-group-list-item');
        pointTemplate = $(pointTemplate.html());
        groupTemplate = $(groupTemplate.html());

        clickEventHandler = listData['clickEventHandler'];
        checkEventHandler = listData['checkEventHandler'];
        editButtonHandler = listData['editButtonHandler'];
        clickCallback = listData['clickCallback'];

        $.each(groups['queue'], function (key, groupId) {
            var group = groups['values'][groupId];

            if (group['points']['queue'].length) {
                itemData = {
                    data : group,
                    template : groupTemplate,
                    editButtonHandler : editButtonHandler
                };

                self.newListGroupItem(list, itemData);

                $.each(group['points']['queue'], function (key, pointId) {
                    itemData = {
                        data : group['points']['values'][pointId],
                        template : pointTemplate,
                        clickEventHandler : clickEventHandler,
                        checkEventHandler : checkEventHandler,
                        clickCallback : clickCallback
                    };

                    self.newListItem(list, itemData);
                });
            }
        });

        T.Managers.ResourcesManager.parse(list);
    };

    self.addItems = function (type, listResource, data, listData) {
        var self = this;
        var template, item, listType, itemsLength, clickEventHandler, checkEventHandler, clickCallback, checkValues, itemData, prepend;

        listType = type.replace(/_/g, "-");
        template = T.Templates.getTemplate(listType + '-list-item');
        template = $(template.html());
        clickEventHandler = listData['clickEventHandler'];
        checkEventHandler = listData['checkEventHandler'];
        clickCallback = listData['clickCallback'];
        prepend = listData['prepend'];

        if (listData['checked_values']) {
            checkValues = listData['checked_values'];
        } else {
            checkValues = [];
        }

        if (T.Utils.objLength(data['values'])) {
            $.each(data['queue'], function (key, id) {
                itemData = {
                    data : data['values'][id],
                    prepend : (prepend ? true : false),
                    template : template,
                    clickEventHandler : clickEventHandler,
                    checkEventHandler : checkEventHandler,
                    clickCallback : clickCallback
                };

                if ($.inArray(id, checkValues) != -1) {
                    itemData['check'] = true;
                }

                self.newListItem(listResource, itemData);
            });

            if (listData['loadMethod']) {
                listResource.loadable(listData);
            }

            T.Managers.ResourcesManager.parse(listResource);
        } else {
            listResource.insertEmptyMessage();
        }
    };

    /**
     * Make new list item by template & data
     * @param list
     * @param template
     * @param data
     * @returns {*}
     */
    self.newListItem = function (list, itemData) {
        var itemResource, itemId, template, data, clickEventHandler, checkEventHandler, clickCallback, prepend;

        template = itemData['template'];
        data = itemData['data'];
        prepend = itemData['prepend'];
        clickEventHandler = itemData['clickEventHandler'];
        checkEventHandler = itemData['checkEventHandler'];
        clickCallback = itemData['clickCallback'];

        itemId = data['id'];
        itemResource = list.findByItemId(itemId);

        if (!itemResource) {
            itemResource = new T.UI.ListItem(template);
            itemResource.fill(data);

            if (prepend) {
                list.prepend(itemResource);
            } else {
                list.append(itemResource);
            }

            if (clickEventHandler) {
                itemResource
                    .click(function () {
                        clickEventHandler(itemResource, data, clickCallback);
                    });
                itemResource.addClass(T.Managers.ResourcesManager.CLICKABLE_ITEM_CLASS);
            }

            if (checkEventHandler) {
                itemResource
                    .oncheck(function () {
                        checkEventHandler(itemResource, data, clickCallback);
                    });
            }

            if (itemData['check']) {
                itemResource.check();
            }
        }
    };

    /**
     * Make new list group item by template & data
     * @param list
     * @param template
     * @param data
     * @returns {*}
     */
    self.newListGroupItem = function (list, itemData) {
        var itemResource, itemId, template, data, editButtonHandler;

        data = itemData['data'];
        itemId = data['id'];
        itemResource = list.findByGroupItemId(itemId);
        template = itemData['template'];
        editButtonHandler = itemData['editButtonHandler'];

        if (!itemResource) {
            itemResource = new T.UI.ListItem(template);
            itemResource.fill(data);
            list.append(itemResource);

            if (editButtonHandler) {
                itemResource.editButtonClick(function () {
                    editButtonHandler(data);
                });
            }
        }
    };

    /**
     * Open full info page for orders, clients, users etc.
     * @param itemResource
     * @param data
     * @param callback
     */
    self.showListItemFullInfo = function (itemResource, data, callback) {
        var template, datatype, fullInfoPage, itemId, controller;

        controller = T.System.Router.getController();

        datatype = itemResource.getElement().attr('datatype');
        itemId = itemResource.getElement().attr('item_id');
        template = T.Templates.getTemplate(datatype + '-item-full-info');
        template = $(template.html());
        fullInfoPage = new T.UI.FullInfoPage(template);
        fullInfoPage.fill(data);
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'page_container').insert({ template : fullInfoPage, newState : true, hide : true});

        if (controller.setCurrentItem) {
            controller.setCurrentItem(itemId);
        }

        if (callback) {
            callback(itemId);
        }
    };

    /**
     * Open add new item page
     * @param datatype
     * @param callback
     */
    self.showMakeNewItemPage = function (datatype, callback) {
        var template, fullInfoPage;

        template = T.Templates.getTemplate(datatype + '-create-page');
        template = $(template);

        fullInfoPage = new T.UI.FullInfoPage(template);
        fullInfoPage.fill();

        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'page_container').insert({ template : fullInfoPage, newState : false, hide : true});

        if (callback) {
            callback();
        }
    };

    /**
     * Open edit item page
     * @param datatype
     * @param callback
     */
    self.showEditItemPage = function (data, datatype, callback) {
        var template, fullInfoPage;

        template = T.Templates.getTemplate(datatype + '-edit-page');
        template = $(template);

        fullInfoPage = new T.UI.FullInfoPage(template);
        fullInfoPage.fill(data);

        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'page_container').insert({ template : fullInfoPage, newState : false, hide : true});

        if (callback) {
            callback();
        }
    };
};