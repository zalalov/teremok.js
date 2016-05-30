/**
 * Agent controller
 */
T.Controllers.Agent = new function () {
    var self = this;

    /**
     * Vocabulary
     * @type {null}
     */
    self.voc = null;

    /**
     * UI
     * @type {null}
     */
    self._mainContainer = null;

    self.DEFAULT_PAGE = 'summary';

    self._currentPage = null;
    self._currentItem = null;

    /**
     * Controller opening
     */
    self.open = function () {
        var actions = T.System.History.getActions();

        self.voc = T.Vocabularies.getVocabulary();
        self._mainContainer = 'agent-container';

        self.initHeader();
        self.initMenu();

        if (T.Utils.objLength(actions)) {
            self.applyActions(actions);
        } else {
            self.openPage(self.DEFAULT_PAGE, true);
        }
    };

    /**
     * Set current page
     * @param page
     */
    self.setCurrentPage = function (page) {
        self._currentPage = page;
    };

    /**
     * Set current item
     * @param item
     */
    self.setCurrentItem = function (item) {
        self._currentItem = item;
    };

    /**
     * Get current page
     */
    self.getCurrentPage = function () {
        return self._currentPage;
    };

    /**
     * Get current item
     */
    self.getCurrentItem = function () {
        return self._currentItem;
    };

    /**
     * Fill header information
     */
    self.initHeader = function () {
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'user_role').setValue(T.System.User.roleTitle);
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'user_fio').setValue(T.System.User.FIO);
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'balance_amount').setMoneyValue(T.System.User.balance);

        self.initReleaseNotes();
    };

    /**
     * Init menu actions
     */
    self.initMenu = function () {
        var menu = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_MENU_TYPE, 'main_menu');
        menu.init();
    };

    /**
     * Load page
     * @param page
     */
    self.openPage = function (page, newState, callback) {
        var template, pageContainer, mainMenu;
        pageContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'page_container');
        mainMenu = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_MENU_TYPE, 'main_menu');

        self.setCurrentPage(page);

        switch (page) {
            case 'summary':
                template = T.Templates.getTemplate('summary-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initStatisticsPage(callback);
                break;

            case 'users':
                template = T.Templates.getTemplate('users-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initUsersPage(callback);
                break;

            case 'points':
                template = T.Templates.getTemplate('points-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initPointsPage(callback);
                break;

            case 'messages':
                template = T.Templates.getTemplate('messages-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initMessagesPage(callback);
                break;

            case 'clients':
                template = T.Templates.getTemplate('clients-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initClientsPage(callback);
                break;

            case 'orders':
                template = T.Templates.getTemplate('orders-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initOrdersPage(callback);
                break;

            case 'tariffs':
                template = T.Templates.getTemplate('tariffs-page');
                template = $(template.html());
                template = new T.UI.Page(template);
                template.fill();
                pageContainer.insert({ template : template, newState : newState});

                self.initTariffsPage(callback);
                break;

            default:
                break;
        }

        mainMenu.selectItem(page);
        pageContainer.showContent();

        T.System.log('T.Controllers.Agent: Page opened: ' + page);
    };

    /**
     * Apply router actions
     * @param actions
     */
    self.applyActions = function (actions) {
        var controller = actions[T.System.History.CONTROLLER_HASH_PART];
        var page = actions[T.System.History.PAGE_HASH_PART];
        var item = actions[T.System.History.ITEM_HASH_PART];
        var list, listItem;

        if (page && controller == T.Controllers.AGENT_CONTROLLER) {
            self.openPage(page, false, function () {

                if (item) {
                    list = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LIST_TYPE, page + '_list');

                    if (list) {
                        listItem = list.findByItemId(item);

                        if (listItem) {
                            listItem.trigger('click');
                        }
                    }
                }
            });
        } else {
            self.openPage(self.DEFAULT_PAGE, true);
        }
    };

    /**
     * Init summary page
     */
    self.initStatisticsPage = function (callback) {
        self.initAccountStats();
        self.initStaticDistribution();
        self.initDynamics();
    };

    /**
     * Init account stats
     * @param callback
     */
    self.initAccountStats = function (callback) {
        self.showAccountStats(callback);
    };

    /**
     * Shows statistics on the page
     * @param callback
     */
    self.showAccountStats = function (callback) {
        self.loadAccountStats({}, function (response) {
            T.Managers.DataManager.parseAccountStats(response);
            T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'page_container').insertSummaryInfo();

            if (callback) {
                callback();
            }
        });
    };

    /**
     * Init dynamics block
     */
    self.initDynamics = function () {
        var fromDay     = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DATE_TYPE, 'dynamics_graph_from_date');
        var fromMonth   = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DATE_TYPE, 'dynamics_graph_from_date_month_type');
        var toDay       = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DATE_TYPE, 'dynamics_graph_to_date');
        var toMonth     = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DATE_TYPE, 'dynamics_graph_to_date_month_type');
        var scale       = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.SELECT_BOX_TYPE, 'dynamics_graph_scale');

        var filterEventsHandlers = new T.UI.ResourcesList([ fromDay, fromMonth, toDay, toMonth ]);

        filterEventsHandlers.change(function () {
            self.showDynamics();
        });

        scale.change(function () {
            if (scale.val() == T.Managers.StatisticsManager.SCALE_DAY) {
                fromMonth.hide();
                toMonth.hide();
                fromMonth.disableFormParam();
                toMonth.disableFormParam();

                fromDay.show();
                toDay.show();
                fromDay.formParam();
                toDay.formParam();
            } else {
                fromDay.hide();
                toDay.hide();
                fromDay.disableFormParam();
                toDay.disableFormParam();

                fromMonth.show();
                toMonth.show();
                fromMonth.formParam();
                toMonth.formParam();
            }

            self.showDynamics();
        });

        self.showDynamics();
    };

    /**
     * Show dynamics block
     */
    self.showDynamics = function () {
        var graphForm = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'dynamics_graph_filter_form');
        var graph = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.GRAPH_TYPE, 'dynamics_graph');
        var detailsBlock = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'dynamics_graph_point_details');
        var errorBlock = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'dynamics_graph_error_message');
        var statsLastPointData;
        var params, data;

        if (graphForm.valid()) {
            params = graphForm.getParams();

            if (T.Managers.StatisticsManager.validFilterData(params)) {
                errorBlock.hide();

                self.loadStats(params, function (response) {
                    data = params;
                    data['response'] = response;

                    T.Managers.DataManager.parseStats(data);

                    statsLastPointData = T.Managers.DataManager.getStatsLastElements(params['scale']);

                    T.Managers.StatisticsManager.showDynamicsGraph(graph, detailsBlock);
                    T.Managers.StatisticsManager.insertPointDetails({ container : detailsBlock, data : statsLastPointData })
                });
            } else {
                graph.hide();
                detailsBlock.hide();
                errorBlock.show();
            }
        }
    };

    /**
     * Init static distribution graphs
     */
    self.initStaticDistribution = function () {
        self.showStaticDistribution();
    };

    /**
     * Show static distribution
     */
    self.showStaticDistribution = function () {
        var ordersToClientsGraph = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.GRAPH_TYPE, 'orders_to_clients_graph');
        var clientsToAmountsGraph = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.GRAPH_TYPE, 'clients_to_amounts_graph');
        var clientsToPeriodsGraph = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.GRAPH_TYPE, 'clients_to_periods_graph');
        var clientsToExpOrdersGraph = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.GRAPH_TYPE, 'clients_to_exp_orders_graph');

        self.loadStatsDistribution({}, function (response) {
            T.Managers.DataManager.parseStatsDistribution(response);
            T.Managers.StatisticsManager.showStaticDistributionGraphs({
                orders_to_clients_graph : ordersToClientsGraph,
                clients_to_amounts_graph: clientsToAmountsGraph,
                clients_to_periods_graph : clientsToPeriodsGraph,
                clients_to_exp_orders_graph : clientsToExpOrdersGraph,
            });
        });
    };

    /**
     * Load stats
     * @param data
     * @param successCallback
     */
    self.loadStats = function (data, successCallback) {
        var cmd;

        if (data['point_id']) {
            cmd = '.point_stats';
        } else {
            cmd = '.stats'
        }

        T.System.Server.AJAX.command(
            T.System.User.role + cmd,
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Load static distribution
     * @param data
     * @param successCallback
     */
    self.loadStatsDistribution = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.static_distribution',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Load account stats
     */
    self.loadAccountStats = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.account_stats',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init users page
     */
    self.initUsersPage = function (callback) {
        self.showUsers(callback);

        var createButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'new_user_button');

        createButton.click(function () {
            T.Managers.ListManager.showMakeNewItemPage(T.Managers.DataManager.USER_DATATYPE, function () {
                var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_user_button');

                saveButton.click(self.createUser);
            });
        });
    };

    /**
     * Create user
     */
    self.createUser = function () {
        var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'user_info_form');
        var params = form.getParams();

        if (form.valid()) {
            self.newUser(params, function () {
                self.openPage('users', true);
            });
        }
    };

    /**
     * Send create user request
     * @param data
     * @param successCallback
     */
    self.newUser = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.user_create',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Load users list
     * @param data
     * @param successCallback
     */
    self.loadUsers = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.users',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show users list
     */
    self.showUsers = function (callback) {
        var params = {};

        var listData = {
            params : params,
            type : T.Managers.ListManager.USERS_LIST_TYPE,
            loadMethod : self.loadUsers,
            clickEventHandler : T.Managers.ListManager.showListItemFullInfo,
            clickCallback : function (userId) {
                self.showUserCallback(userId);
            }
        };

        self.loadUsers(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Show user callback
     * @param userId
     */
    self.showUserCallback = function (userId) {
        var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_user_info');
        var deleteButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'delete_user');
        var blockButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'block_user');
        var unblockButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'unblock_user');
        var user = T.Managers.DataManager.getUser(userId);

        self.showUserRoles(userId);
        self.showUserPoints(userId);

        saveButton.click(function () {
            var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'user_info_form');
            var params = form.getParams();

            if (form.valid()) {
                params['user_id'] = userId;
                self.updateUser(params);
            }
        });

        deleteButton.click(function () {
            var data = {
                text : 'Вы уверены?',
                yesCallback : function () {
                    var params = {
                        user_id : userId
                    };

                    self.deleteUser(params, function () {
                        self.openPage('users', true);
                    });
                }
            };

            T.UI.confirm(data);
        });
    };

    /**
     * Send delete user request
     * @param data
     * @param successCallback
     */
    self.deleteUser = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.user_delete',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Send update user request
     * @param data
     * @param successCallback
     */
    self.updateUser = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.user_update',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show user's roles
     * @param userId
     */
    self.showUserRoles = function (userId) {
        var params = {};
        var checkedValues = [];
        var user = T.Managers.DataManager.getUsers()['values'][userId];

        $.each(user['roles']['queue'], function (key, roleId) {
            checkedValues.push(roleId);
        });

        /**
         * Checked values property are filled if list contains items with checkboxes
         */
        var listData = {
            parent_id : userId,
            params  : params,
            type    : T.Managers.ListManager.USER_ROLES_LIST,
            checked_values : checkedValues,
            checkEventHandler : function (itemResource, data) {
                var params = {
                    user_id : userId,
                    role_id : data['id']
                };

                if (itemResource.isChecked()) {
                    self.bindRole(params);
                } else {
                    self.unbindRole(params);
                }
            }
        };

        self.loadRoles(
            params,
            function (response) {
                var parsedData = T.Managers.DataManager.parse(response);
                listData['bindable_roles'] = parsedData['roles'];

                T.Managers.ListManager.fillList(listData);
            }
        );
    };

    /**
     * Bind role to user
     * @param userId
     * @param roleId
     */
    self.bindRole = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.add_role',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Unbind role from user
     * @param userId
     * @param roleId
     */
    self.unbindRole = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.remove_role',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Add/remove point to user relation
     * @param data
     * @param successCallback
     */
    self.pointToUserToggle = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.point_to_user_toggle',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Load availible roles
     * @param data
     * @param successCallback
     */
    self.loadRoles = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.roles',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show user's points
     * @param userId
     */
    self.showUserPoints = function (userId) {
        var params = {
            user_id : userId
        };

        var list = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LIST_TYPE, T.Managers.ListManager.USER_POINTS_LIST + '_list');

        var listData = {
            parent_id : userId,
            params : params,
            type : T.Managers.ListManager.USER_POINTS_LIST,
            loadMethod : self.loadUserPoints,
            checkEventHandler : function (itemResource, data) {
                var params = {
                    user_id : userId,
                    point_id : data['id']
                };

                self.pointToUserToggle(params);
            }
        };

        self.loadUserPoints(
            params,
            function (response) {
                T.Managers.DataManager.parse(response);
                T.Managers.ListManager.fillList(listData);
            });
    };

    /**
     * Load points binde to user
     * @param data
     * @param successCallback
     */
    self.loadUserPoints = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.get_user_binding',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init points page
     */
    self.initPointsPage = function (callback) {
        self.showPoints(callback);

        var createButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'add_new_item');

        createButton.click(function () {
            T.Managers.ListManager.showMakeNewItemPage(T.Managers.DataManager.POINT_DATATYPE, function () {
                var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_point_button');

                self.showPointGroups();

                saveButton.click(function () {
                    self.newPoint();
                });

            });
        });
    };

    /**
     * Show point groups
     */
    self.showPointGroups = function () {
        var listData = {
            type    : T.Managers.ListManager.POINT_GROUPS_LIST,
            prepend : true
        };

        T.Managers.ListManager.fillList(listData);
    };

    /**
     * Load points list
     */
    self.loadPoints = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.points',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show points list
     */
    self.showPoints = function (callback) {
        var params = {};

        var listData = {
            params : params,
            type : T.Managers.ListManager.POINTS_LIST_TYPE,
            loadMethod : self.loadPoints,
            clickEventHandler : T.Managers.ListManager.showListItemFullInfo,
            editButtonHandler : self.editPointGroup,
            clickCallback : function (pointId) {
                self.showPointCallback(pointId);
            }
        };

        self.loadPoints(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Show point callback
     * @param pointId
     */
    self.showPointCallback = function (pointId) {
        self.showPointTariffs(pointId);
        self.showPointsUsers(pointId);

        var pointParam = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INPUT_TYPE, 'dynamics_graph_point_id');

        if (pointParam) {
            pointParam.formParam();
            pointParam.val(pointId);

            self.initDynamics();
        }

        var deleteButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'delete_point_button');
        var editButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'edit_point_button');

        deleteButton.click(function () {
            var confirmData = {
                text : 'Вы уверены?',
                yesCallback : function () {
                    var params = {
                        point_id : pointId
                    };

                    self.deletePoint(params, function () {
                        self.openPage('points', true);
                    });
                }
            };

            T.UI.confirm(confirmData);
        });

        editButton.click(function () {
            self.editPoint(pointId);
        });
    };

    /**
     * Edit point's group
     * @param groupId
     * @param groupName
     */
    self.editPointGroup = function (group) {
        var template, editDialog, body;
        template = T.Templates.getTemplate('edit-points-group-dialog');

        if (!template.length) {
            T.System.errorLog('Can\'t find edit point group dialog!');
            return;
        }

        template = $(template.html());
        editDialog = new T.UI.Dialog(template);
        editDialog.fill(group);
        body = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'body');
        body.append(editDialog);

        editDialog.buttonClick('save-button', function () {
            var form, params, newName;

            newName = editDialog.getElement().find('.group_name').val();

            params = {
                group_id : group['id'],
                name : newName
            };

            if (newName) {
                self.updatePointGroup(params, function () {
                    editDialog.remove();
                    self.openPage('points', true);
                });
            }
        });

        editDialog.buttonClick('cancel-button', function () {
            editDialog.remove();
        });

        editDialog.show();
    };

    /**
     * Update point's group
     * @param data
     * @param successCallback
     */
    self.updatePointGroup = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.point_group_update',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Edit selected point
     */
    self.editPoint = function (pointId) {
        var point = T.Managers.DataManager.getPoint(pointId);

        T.Managers.ListManager.showEditItemPage(point, T.Managers.DataManager.POINT_DATATYPE, function () {
            var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_point_button');

            saveButton.click(function () {
                var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'point_edit_form');
                var params;

                if (form.valid()) {
                    params = form.getParams();
                    params['point_id'] = pointId;

                    self.updatePoint(params, function () {
                        self.openPage('points', true);
                    })
                }
            });
        });
    };

    /**
     * Send update command
     * @param data
     * @param successCallback
     */
    self.updatePoint = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.point_update',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Delete user
     * @param data
     * @param successCallback
     */
    self.deletePoint = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.point_delete',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show point's tariffs
     */
    self.showPointTariffs = function (pointId) {
        var params = {};
        var checkedValues = [];
        var user = T.Managers.DataManager.getPoints()['values'][pointId];

        $.each(user['tariffs']['queue'], function (key, roleId) {
            checkedValues.push(roleId);
        });

        /**
         * Checked values property are filled if list contains items with checkboxes
         */
        var listData = {
            parent_id : pointId,
            params  : params,
            type    : T.Managers.ListManager.POINT_TARIFFS_LIST,
            checked_values : checkedValues,
            checkEventHandler : function (itemResource, data) {
                var params = {
                    point_id    : pointId,
                    tariff_id   : data['id']
                };

                if (itemResource.isChecked()) {
                    self.bindTariff(params);
                } else {
                    self.unbindTariff(params);
                }
            }
        };

        self.loadTariffs(
            params,
            function (response) {
                T.Managers.DataManager.parse(response);
                T.Managers.ListManager.fillList(listData);
            }
        );
    };

    /**
     * Bind tariff to point
     * @param data
     * @param successCallback
     */
    self.bindTariff = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.bind_tariff',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Unbind tariff from point
     * @param data
     * @param successCallback
     */
    self.unbindTariff = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role  + '.unbind_tariff',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show point's users
     * @param pointId
     */
    self.showPointsUsers = function (pointId) {
        var params = {
            point_id : pointId
        };

        var list = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LIST_TYPE, T.Managers.ListManager.POINT_USERS_LIST + '_list');

        var listData = {
            parent_id : pointId,
            params : params,
            type : T.Managers.ListManager.POINT_USERS_LIST,
            loadMethod : self.loadPointUsers,
            checkEventHandler : function (itemResource, data) {
                var params = {
                    point_id : pointId,
                    user_id : data['id']
                };

                self.pointToUserToggle(params);
            }
        };

        self.loadPointUsers(
            params,
            function (response) {
                T.Managers.DataManager.parse(response);
                T.Managers.ListManager.fillList(listData);
            });
    };

    /**
     * Load point binded users
     * @param pointId
     */
    self.loadPointUsers = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.get_point_binding',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Creates new point
     */
    self.newPoint = function () {
        var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'point_create_form');

        if (form) {
            if (form.valid()) {
                var params = form.getParams();

                self.createPoint(params, function () {
                    self.openPage('points', true);
                });
            }
        }
    };

    /**
     * Send create new point request
     * @param data
     * @param successCallback
     */
    self.createPoint = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.point_create',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init messages page
     * @param callback
     */
    self.initMessagesPage = function (callback) {
        self.showMessages(callback);
    };

    /**
     * Show messages list
     */
    self.showMessages = function (callback) {
        var params, listData;

        params = {}

        listData = {
            params      : params,
            type        : T.Managers.ListManager.MESSAGES_LIST_TYPE,
            loadMethod  : self.loadMessages,
            clear       : true
        };

        self.loadMessages(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Load sms messages
     * @param data
     * @param successCallback
     */
    self.loadMessages = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.messages',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init clients page
     */
    self.initClientsPage = function (callback) {
        self.showClients(callback);
    };

    /**
     * Load clients list
     * @param data
     * @param successCallback
     */
    self.loadClients = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.clients',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show clients list
     */
    self.showClients = function (callback) {
        var form, params, listData;

        form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'clients_list_filter');

        // Filter's buttons 'show' & 'reset'
        form.find('clients_list_filter_apply').click(function () {
            self.showClients();
        });
        form.find('clients_list_filter_reset').click(function () {
            form.reset();
            self.showClients();
        });

        params = form.getParams();
        params['offset'] = 0;

        listData = {
            params      : params,
            type        : T.Managers.ListManager.CLIENTS_LIST_TYPE,
            loadMethod  : self.loadClients,
            clickEventHandler : T.Managers.ListManager.showListItemFullInfo,
            clear       : true
        };

        self.loadClients(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Init orders page
     */
    self.initOrdersPage = function (callback) {
        var date = new Date();
        var list = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LIST_TYPE, 'orders_list');
        var statuses;

        // Filling order's filters
        statuses = T.Models.Order.statusesTranslates;
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.SELECT_BOX_TYPE, 'orders_list_filter_status').fill(statuses);

        self.showOrders(callback);
    };

    /**
     * Load orders list
     * @param data
     * @param successCallback
     */
    self.loadOrders = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.orders',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show orders list
     */
    self.showOrders = function (callback) {
        var form, params, listData;

        form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'orders_list_filter');

        // Filter's buttons 'show' & 'reset'
        form.find('orders_list_filter_apply').click(function () {
            self.showOrders();
        });
        form.find('orders_list_filter_reset').click(function () {
            form.reset();
            self.showOrders();
        });

        params = form.getParams();
        params['offset'] = 0;

        listData = {
            params      : params,
            type        : T.Managers.ListManager.ORDERS_LIST_TYPE,
            loadMethod  : self.loadOrders,
            clickEventHandler : T.Managers.ListManager.showListItemFullInfo,
            clickCallback : function (orderId) {
                self.showOrderCallback(orderId);
            },
            clear       : true
        };

        self.loadOrders(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Show order callback
     */
    self.showOrderCallback = function (orderId) {
        self.showOrderOperations(orderId);
    };

    /**
     * Load orders operations
     * @param data
     * @param successCallback
     */
    self.loadOrderOperations = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.get_order_transactions',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show order operations in order full info page
     */
    self.showOrderOperations = function (orderId) {
        var params = {}, listData;

        params['order_id'] = orderId;
        params['offset'] = 0;

        listData = {
            parent_id   : orderId,
            params      : params,
            type        : T.Managers.ListManager.ORDER_OPERATIONS_LIST,
            loadMethod  : self.loadOrderOperations,
            clear       : true
        };

        self.loadOrderOperations(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);
            });
    };

    /**
     * Init tariffs page
     */
    self.initTariffsPage = function (callback) {
        self.showTariffs(callback);

        var newItemButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'add_new_item');

        newItemButton.click(function () {
            T.Managers.ListManager.showMakeNewItemPage(T.Managers.DataManager.TARIFF_DATATYPE, function () {
                var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_tariff_button');

                saveButton.click(function () {
                    self.newTariff();
                });

            });
        });
    };

    /**
     * Show tariffs list
     * @param callback
     */
    self.showTariffs = function (callback) {
        var params = {};

        var listData = {
            params : params,
            type : T.Managers.ListManager.TARIFFS_LIST_TYPE,
            loadMethod : self.loadTariffs,
            clickEventHandler : T.Managers.ListManager.showListItemFullInfo,
            clickCallback : function (tariffId) {
                var saveButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'save_tariff_button');

                saveButton.click(function () {
                    self.saveTariff(tariffId);
                });
            }
        };

        self.loadTariffs(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);

                if (callback) {
                    callback();
                }
            });
    };

    /**
     * Load tariffs list
     * @param data
     * @param successCallback
     */
    self.loadTariffs = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.get_tariffs',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Save tariff
     */
    self.saveTariff = function (tariffId) {
        var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'tariff_info_form');

        if (form) {
            var params = form.getParams();
            params['tariff_id'] = tariffId;

            self.updateTariff(params, function () {
                var backButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINK_TYPE, 'back_to_list');

                if (backButton) {
                    backButton.backToList();
                }
            });
        }
    };

    /**
     * Save tariff
     */
    self.newTariff = function () {
        var form = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.FORM_TYPE, 'tariff_info_form');

        if (form) {
            if (form.valid()) {
                var params = form.getParams();

                self.createTariff(params, function () {
                    self.openPage('tariffs', true);
                });
            }
        }
    };

    /**
     * Update tariff
     * @param data
     * @param successCallback
     */
    self.updateTariff = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.update_tariff',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Create tariff
     * @param data
     * @param successCallback
     */
    self.createTariff = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.create_tariff',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init release notes list
     */
    self.initReleaseNotes = function (callback) {
        self.showReleaseNotes(callback);
    };

    /**
     * Load release notes list
     * @param data
     * @param successCallback
     */
    self.loadReleaseNotes = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.release_notes',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Show release notes
     */
    self.showReleaseNotes = function (callback) {
        var params = {
            offset : 0
        };

        var listData = {
            params : params,
            type : T.Managers.ListManager.RELEASE_NOTES_LIST,
            loadMethod : self.loadReleaseNotes
        };

        self.loadReleaseNotes(
            params,
            function (response) {
                T.Managers.DataManager.parse(response, true);
                T.Managers.ListManager.fillList(listData);
            });
    };
};

/**
 * Insert summary data in summary page
 */
T.UI.Container.prototype.insertSummaryInfo = function () {
    var stats = T.Managers.DataManager.getAccountStats();

    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'gross_profit_value').setMoneyValue(stats['money']['balance']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'dispensers_money_value').setMoneyValue(stats['money']['terminals_balance_out']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'billacceptors_money_value').setMoneyValue(stats['money']['terminals_balance_in']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'issued_money_value').setMoneyValue(stats['money']['paid']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'returned_money_value').setMoneyValue(stats['money']['repaid']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'returned_borrowed_funds_value').setMoneyValue(stats['money']['principal_repaid']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'returned_percents_of_orders_value').setMoneyValue(stats['money']['interest_repaid']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'debt_value').setMoneyValue(stats['money']['total_debt']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'debt_borrowed_funds_value').setMoneyValue(stats['money']['principal_debt']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'debt_percents_of_orders_value').setMoneyValue(stats['money']['interest_debt']);

    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'total_clients_count').setValue(stats['clients']['real_clients']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'phones_in_base_value').setValue(stats['clients']['phones']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'avg_order_amount_value').setMoneyValue(stats['clients']['avg_amount']);

    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'total_orders_count').setValue(stats['orders']['created']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'loans_total_value').setValue(stats['orders']['paid']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'active_orders_value').setValue(stats['orders']['active']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'orders_in_progress_value').setValue(stats['orders']['in_process']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'today_orders_value').setValue(stats['orders']['today']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'yesterday_orders_value').setValue(stats['orders']['yesterday']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'repaid_orders_value').setValue(stats['orders']['closed']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINE_TYPE, 'repaid_orders_percents_value').setValue(T.Utils.percentage(stats['orders']['closed'], stats['orders']['paid']));
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'overdued_orders_value').setValue(stats['orders']['expired']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINE_TYPE, 'overdued_orders_percents_value').setValue(T.Utils.percentage(stats['orders']['expired'], stats['orders']['paid']));
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'in_court_value').setValue(stats['orders']['to_court']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'in_court_to_amount_of_value').setMoneyValue(stats['orders']['to_court_amount']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'approved_orders_value').setValue(stats['orders']['approved']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINE_TYPE, 'approved_orders_percents_value').setValue(T.Utils.percentage(stats['orders']['approved'], stats['orders']['created']));
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'rejected_orders_value').setValue(stats['orders']['rejected']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINE_TYPE, 'rejected_orders_percents_value').setValue(T.Utils.percentage(stats['orders']['rejected'], stats['orders']['created']));
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'rejected_by_self_value').setValue(stats['orders']['cancelled']);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.LINE_TYPE, 'rejected_by_self_percents_value').setValue(T.Utils.percentage(stats['orders']['cancelled'], stats['orders']['created']));
};