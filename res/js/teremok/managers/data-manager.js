/**
 * Data manager
 * Contains all orders, clients, points etc. data
 */
T.Managers.DataManager = new function () {
    var self = this;

    /**
     * Creates simple data object
     * @param queue
     * @param values
     */
    self.dataListObj = function (queue, values) {
        return {
            queue : queue,
            values : values
        };
    };

    self._orders        = null;
    self._clients       = null;
    self._points        = null;
    self._users         = null;
    self._tariffs       = null;
    self._operations    = null;
    self._pointGroups   = null;
    self._releaseNotes  = null;
    self._roles         = null;
    self._messages      = null;

    self._accountStats      = null;
    self._stats             = null;
    self._statsDistribution = null;

    self._pointTypes = self.dataListObj([0, 1], { 0 : 'auto', 1 : 'manual' });

    self.ORDER_DATATYPE        = 'order';
    self.CLIENT_DATATYPE       = 'client';
    self.POINT_DATATYPE        = 'point';
    self.USER_DATATYPE         = 'user';
    self.TARIFF_DATATYPE       = 'tariff';
    self.OPERATION_DATATYPE    = 'operation';
    self.RELEASE_NOTE_DATATYPE = 'release-note';
    self.ROLE_DATATYPE         = 'role';
    self.MESSAGE_DATATYPE      = 'message';

    self.emptyDataListObj = function () {
        var obj = self.dataListObj([], {});

        return obj;
    };

    /**
     * Clear data
     */
    self.clear = function () {
        self._orders        = self.emptyDataListObj();
        self._clients       = self.emptyDataListObj();
        self._pointGroups   = self.emptyDataListObj();
        self._points        = self.emptyDataListObj();
        self._users         = self.emptyDataListObj();
        self._tariffs       = self.emptyDataListObj();
        self._accountStats  = self.emptyDataListObj();
        self._releaseNotes  = self.emptyDataListObj();
        self._operations    = self.emptyDataListObj();
        self._roles         = self.emptyDataListObj();
        self._messages      = self.emptyDataListObj();
    };

    self.clear();

    /**
     * Parse responses
     * @param response
     */
    self.parse = function (response, clear) {
        var response = $(response);
        var data = {};

        if (clear == true) {
            self.clear();
        }

        var orders = response.find('order');
        var clients = response.find('client');
        var groups = response.find('group');
        var points = response.find('point');
        var users = response.find('user');
        var tariffs = response.find('tariff');
        var operations = response.find('transaction');
        var releaseNotes = response.find('release_notes');
        var roles = response.find('role');
        var messages = response.find('message');
        var id, groupId;

        if (orders.length) {
            data['orders'] = self.emptyDataListObj();

            $.each(orders, function (key, order) {
                var order = $(order);
                id = order.attr('id');

                data['orders']['queue'].push(id);
                data['orders']['values'][id] = T.Models.Order.parse(order);

                if (self._orders['values'][id]) {
                    T.System.log('T.Managers.DataManager: Order with id = ' + id + 'already exists!');
                } else {
                    self._orders['queue'].push(id);
                    self._orders['values'][id] = T.Models.Order.parse(order);
                }
            });
        }

        if (clients.length) {
            data['clients'] = self.emptyDataListObj();

            $.each(clients, function (key, client) {
                var client = $(client);
                id = client.attr('id');

                data['clients']['queue'].push(id);
                data['clients']['values'][id] = T.Models.Client.parse(client);

                if (self._clients['values'][id]) {
                    T.System.log('T.Managers.DataManager: Client with id = ' + id + 'already exists!');
                } else {
                    self._clients['queue'].push(id);
                    self._clients['values'][id] = T.Models.Client.parse(client);
                }
            });
        }

        if (points.length) {
            var groupId, pointId;
            data['pointGroups'] = self.emptyDataListObj();

            $.each(groups, function (key, group) {
                groupId = $(group).attr('id');

                data['pointGroups']['queue'].push(id);
                data['pointGroups']['values'][id] = T.Models.PointGroup.parse(group);

                if (self._pointGroups['values'][groupId]) {
                    T.System.log('T.Managers.DataManager: Point group with id = ' + id + 'already exists!');
                } else {
                    self._pointGroups['queue'].push(groupId);
                    self._pointGroups['values'][groupId] = T.Models.PointGroup.parse(group);
                }
            });

            data['points'] = self.emptyDataListObj();

            $.each(points, function (key, point) {
                var point = $(point);
                id = point.attr('id');

                data['points']['queue'].push(id);
                data['points']['values'][id] = T.Models.Point.parse(point);

                if (self._points['values'][id]) {
                    T.System.log('T.Managers.DataManager: Point with id = ' + id + 'already exists!');
                } else {
                    self._points['queue'].push(id);
                    self._points['values'][id] = T.Models.Point.parse(point);
                }
            });
        }

        if (users.length) {
            data['users'] = self.emptyDataListObj();

            $.each(users, function (key, user) {
                var user = $(user);
                id = user.attr('id');

                data['users']['queue'].push(id);
                data['users']['values'][id] = T.Models.User.parse(user);

                if (self._users['values'][id]) {
                    T.System.log('T.Managers.DataManager: User with id = ' + id + 'already exists!');
                } else {
                    self._users['queue'].push(id);
                    self._users['values'][id] = T.Models.User.parse(user);
                }
            });
        }

        if (tariffs.length) {
            data['tariffs'] = self.emptyDataListObj();

            $.each(tariffs, function (key, tariff) {
                var tariff = $(tariff);
                id = tariff.attr('id');

                data['tariffs']['queue'].push(id);
                data['tariffs']['values'][id] = T.Models.Tariff.parse(tariff);

                if (self._tariffs['values'][id]) {
                    T.System.log('T.Managers.DataManager: Tariff with id = ' + id + 'already exists!');
                } else {
                    self._tariffs['queue'].push(id);
                    self._tariffs['values'][id] = T.Models.Tariff.parse(tariff);
                }
            });
        }

        if (operations.length) {
            data['operations'] = self.emptyDataListObj();

            $.each(operations, function (key, operation) {
                var operation = $(operation);
                id = operation.attr('id');

                data['operations']['queue'].push(id);
                data['operations']['values'][id] = T.Models.Transaction.parse(operation);

                if (self._operations['values'][id]) {
                    T.System.log('T.Managers.DataManager: Transaction with id = ' + id + 'already exists!');
                } else {
                    self._operations['queue'].push(id);
                    self._operations['values'][id] = T.Models.Transaction.parse(operation);
                }
            });
        }

        if (releaseNotes.length) {
            data['releaseNotes'] = self.emptyDataListObj();

            $.each(releaseNotes, function (key, rNote) {
                var rNote = $(rNote);
                id = rNote.attr('version');

                data['releaseNotes']['queue'].push(id);
                data['releaseNotes']['values'][id] = T.Models.ReleaseNote.parse(rNote);

                if (self._releaseNotes['values'][id]) {
                    T.System.log('T.Managers.DataManager: Release note with id = ' + id + 'already exists!');
                } else {
                    self._releaseNotes['queue'].push(id);
                    self._releaseNotes['values'][id] = T.Models.ReleaseNote.parse(rNote);
                }
            });
        }

        if (roles.length) {
            data['roles'] = self.emptyDataListObj();

            $.each(roles, function (key, role) {
                var role = $(role);
                id = role.attr('id');

                data['roles']['queue'].push(id);
                data['roles']['values'][id] = T.Models.Role.parse(role);

                if (self._roles['values'][id]) {
                    T.System.log('T.Managers.DataManager: Role with id = ' + id + 'already exists!');
                } else {
                    self._roles['queue'].push(id);
                    self._roles['values'][id] = T.Models.Role.parse(role);
                }
            });
        }

        if (messages.length) {
            data['messages'] = self.emptyDataListObj();

            $.each(messages, function (key, message) {
                var message = $(message);
                id = message.attr('id');

                data['messages']['queue'].push(id);
                data['messages']['values'][id] = T.Models.Message.parse(message);

                if (self._messages['values'][id]) {
                    T.System.log('T.Managers.DataManager: Message with id = ' + id + 'already exists!');
                } else {
                    self._messages['queue'].push(id);
                    self._messages['values'][id] = T.Models.Message.parse(message);
                }
            });
        }

        return data;
    };

    /**
     * Parse stats
     * @param data
     * @returns {*}
     */
    self.parseStats = function (createData) {
        var response = $(createData['response']);
        var from = Date.parse(createData['from']);
        var to = Date.parse(createData['to']);
        var scale = createData['scale'];

        if (isNaN(from) || isNaN(to)) {
            T.System.errorLog('T.Managers.DataManager.parseStats: Params invalid');
            return null;
        }

        from = new Date(from);
        to = new Date(to);

        var date = from;

        var entries;
        var entry;
        var data;

        self._stats = {};

        self._stats['amount_in'] = [];
        self._stats['amount_out'] = [];
        self._stats['amount_percent'] = [];
        self._stats['amount_penalty'] = [];
        self._stats['orders_num'] = [];
        self._stats['paid_orders'] = [];
        self._stats['repaid_orders'] = [];

        entries = response.find(scale);

        self._stats['scale'] = scale;

        while (date <= to) {
            if (scale == T.Managers.StatisticsManager.SCALE_DAY) {
                entry = entries.filter(scale + '[value=' + date.format(dateFormat.masks.isoDate) + ']');

                if (entry.length) {
                    data = self.newStatsEntry({ response : entry });
                } else {
                    data = self.newStatsEntry({ date : date });
                }

                date.setDate(date.getDate() + 1);
            } else {
                entry = entries.filter(scale + '[value=' + date.format(dateFormat.masks.isoDateMonth) + ']');

                if (entry.length) {
                    data = self.newStatsEntry({ response : entry });
                } else {
                    data = self.newStatsEntry({ date : date });
                }

                date.setMonth(date.getMonth() + 1);
            }

            self._stats['amount_in'].push(data['amount_in']);
            self._stats['amount_out'].push(data['amount_out']);
            self._stats['amount_percent'].push(data['amount_percent']);
            self._stats['amount_penalty'].push(data['amount_penalty']);
            self._stats['orders_num'].push(data['orders_num']);
            self._stats['paid_orders'].push(data['paid_orders']);
            self._stats['repaid_orders'].push(data['repaid_orders']);
        }

        return self._stats;
    };

    /**
     * Parse static distribution
     * @param response
     * @returns {null|*}
     */
    self.parseStatsDistribution = function (response) {
        var response = $(response);

        self._statsDistribution = {
            orders_to_clients       : { orders  : [], clients : [] },
            clients_to_amounts      : { amounts : [], clients : [] },
            clients_to_periods      : { clients : [], intervals : [] },
            clients_to_exp_orders   : { clients : [], orders : [] }
        };

        var ordersToClients = response.find('orders_to_clients').children('range');
        var clientsToAmounts = response.find('clients_to_amounts').children('range');
        var clientsToPeriods = response.find('clients_to_periods').children('range');
        var clientsToExpOrders = response.find('clients_to_exp_orders').children('range');

        $.each(ordersToClients, function (key, value) {
            self._statsDistribution['orders_to_clients']['orders'].push(parseInt($(value).attr('orders')));
            self._statsDistribution['orders_to_clients']['clients'].push(parseInt($(value).attr('clients')));
        });

        $.each(clientsToAmounts, function (key, value) {
            self._statsDistribution['clients_to_amounts']['amounts'].push(parseInt($(value).attr('amount')));
            self._statsDistribution['clients_to_amounts']['clients'].push(parseInt($(value).attr('clients')));
        });

        $.each(clientsToPeriods, function (key, value) {
            self._statsDistribution['clients_to_periods']['intervals'].push($(value).attr('interval'));
            self._statsDistribution['clients_to_periods']['clients'].push(parseInt($(value).attr('clients')));
        });

        $.each(clientsToExpOrders, function (key, value) {
            self._statsDistribution['clients_to_exp_orders']['clients'].push(parseInt($(value).attr('clients')));
            self._statsDistribution['clients_to_exp_orders']['orders'].push(parseInt($(value).attr('orders')));
        });

        return self._statsDistribution;
    };

    /**
     * Parse stats entry
     * @param response
     * @returns {{}}
     */
    self.newStatsEntry = function (entryData) {
        var response;
        var date;

        var data = {};

        var amountIn;
        var amountOut;
        var amountPercent;
        var amountPenalty;
        var ordersNum;
        var paidOrders;
        var repaidOrders;

        if (entryData['response']) {
            response = $(entryData['response']);
        } else if (entryData['date']){
            date = entryData['date'];
        }

        if (!response && !date) {
            T.System.errorLog('T.Managers.DataManager.newStatsEntry: Params invalid');
            return null;
        }

        // If response exists fill values by response, else create empty values by date parameter
        if (response) {
            amountIn = [];
            amountIn[0] = new Date(response.attr('value')).getTime();
            amountIn[1] = parseInt($(response.find('in')).attr('value'));

            amountOut = [];
            amountOut[0] = new Date(response.attr('value')).getTime();
            amountOut[1] = parseInt($(response.find('out')).attr('value'));

            amountPercent = [];
            amountPercent[0] = new Date(response.attr('value')).getTime();
            amountPercent[1] = parseInt($(response.find('interest')).attr('value'));

            amountPenalty = [];
            amountPenalty[0] = new Date(response.attr('value')).getTime();
            amountPenalty[1] = parseInt($(response.find('penalty')).attr('value'));

            ordersNum = [];
            ordersNum[0] = new Date(response.attr('value')).getTime();
            ordersNum[1] = parseInt($(response.find('orders_num')).attr('value'));

            paidOrders = [];
            paidOrders[0] = new Date(response.attr('value')).getTime();
            paidOrders[1] = parseInt($(response.find('paid_orders')).attr('value'));

            repaidOrders = [];
            repaidOrders[0] = new Date(response.attr('value')).getTime();
            repaidOrders[1] = parseInt($(response.find('repaid_orders')).attr('value'));
        } else {
            amountIn = [date.getTime(), 0];
            amountOut = [date.getTime(), 0];
            amountPercent = [date.getTime(), 0];
            amountPenalty = [date.getTime(), 0];
            ordersNum = [date.getTime(), 0];
            paidOrders = [date.getTime(), 0];
            repaidOrders = [date.getTime(), 0];
        }

        data['amount_in']       = amountIn;
        data['amount_out']      = amountOut;
        data['amount_percent']  = amountPercent;
        data['amount_penalty']  = amountPenalty;
        data['orders_num']      = ordersNum;
        data['paid_orders']     = paidOrders;
        data['repaid_orders']   = repaidOrders;

        return data;
    };

    /**
     * Parse account stats
     * @param response
     */
    self.parseAccountStats = function (response) {
        var response = $(response);
        var stats = {};

        self._accountStats = {};

        stats['money'] = response.find('money');
        stats['clients'] = response.find('clients');
        stats['orders'] = response.find('orders');

        $.each(stats, function (key, value) {
            $.each(value[0].attributes, function (attrKey, attrValue) {
                if (!self._accountStats[key]) {
                    self._accountStats[key] = {};
                }

                self._accountStats[key][attrValue.name] = attrValue.value;
            });
        });
    };

    /**
     * Get all orders
     * @returns {{}|*}
     */
    self.getOrders = function () {
        return self._orders;
    };

    /**
     * Get order by id
     * @param id
     */
    self.getOrder = function (id) {
        if (!self._orders['values'][id]) {
            T.System.errorLog('No order with id: ' + id);
            return null;
        }

        return self._orders['values'][id];
    };

    /**
     * Get all client's orders
     * @param clientId
     */
    self.getClientOrders = function (clientId) {
        var orders = {};

        $.each(self._orders['values'], function (key, value) {
            if (value['client_id'] == clientId) {
                orders[value['id']] = value;
            }
        });

        return orders;
    };

    /**
     * Get all clients
     * @returns {{}|*}
     */
    self.getClients = function () {
        return self._clients;
    };

    /**
     * Get client by id
     * @param id
     */
    self.getClient = function (id) {
        if (!self._clients['values'][id]) {
            T.System.errorLog('No client with id: ' + id);
            return null;
        }

        return self._clients['values'][id];
    };

    /**
     * Get all points
     * @returns {{}|*}
     */
    self.getPoints = function () {
        return self._points;
    };

    /**
     * Get point types
     */
    self.getPointTypes = function () {
        return self._pointTypes;
    };

    /**
     * Get point by ID
     * @param pointId
     */
    self.getPoint = function (id) {
        if (!self._points['values'][id]) {
            T.System.errorLog('No point with id:' + id);
            return null;
        }

        return self._points['values'][id];
    };

    /**
     * Get all users
     * @returns {{}|*}
     */
    self.getUsers = function () {
        return self._users;
    };

    /**
     * Get user by id
     * @param id
     */
    self.getUser = function (id) {
        if (!self._users['values'][id]) {
            T.System.errorLog('No user with id:' + id);
            return null;
        }

        return self._users['values'][id];
    };

    self.getTariffs = function () {
        return self._tariffs;
    };

    /**
     * Get all operations
     * @returns {{}|*}
     */
    self.getOperations = function () {
        return self._operations;
    };

    /**
     * Get order's operations
     * @param orderId
     */
    self.getOrderOperations = function (orderId) {
        var operations = {
            queue   : [],
            values  : {}
        };

        $.each(self._operations['queue'], function (key, operationId) {
            if (self._operations['values'][operationId]['order_id'] == orderId) {
                operations['queue'].push(operationId);
                operations['values'][operationId] = self._operations['values'][operationId];
            }
        });

        return operations;
    };

    /**
     * Get release notes
     */
    self.getReleaseNotes = function () {
        return self._releaseNotes;
    };

    /**
     * Get sms messages
     */
    self.getMessages = function () {
        return self._messages;
    };

    /**
     * Returns stats
     * @returns {null|*}
     */
    self.getStatsData = function () {
        return self._stats;
    };

    /**
     * Returns last point of stats request
     * @returns {{amount_in: *, amount_out: *, amount_percent: *, amount_penalty: *, orders_num: *, paid_orders: *, repaid_orders: *}}
     */
    self.getStatsLastElements = function (scale) {
        var ts = T.Utils.getLastArrayElement(self._stats['amount_in'])[0];
        var date = new Date(ts);

        if (scale == T.Managers.StatisticsManager.SCALE_DAY) {
            date = T.Vocabularies.getVocabulary().fullDate(date.getFullYear(), date.getMonth(), date.getDate());
        } else {
            date = T.Vocabularies.getVocabulary().fullDate(date.getFullYear(), date.getMonth());
        }

        var last = {
            date            : date,
            amount_in       : T.Utils.getLastArrayElement(self._stats['amount_in'])[1],
            amount_out      : T.Utils.getLastArrayElement(self._stats['amount_out'])[1],
            amount_percent  : T.Utils.getLastArrayElement(self._stats['amount_percent'])[1],
            amount_penalty  : T.Utils.getLastArrayElement(self._stats['amount_penalty'])[1],
            orders_num      : T.Utils.getLastArrayElement(self._stats['orders_num'])[1],
            paid_orders     : T.Utils.getLastArrayElement(self._stats['paid_orders'])[1],
            repaid_orders   : T.Utils.getLastArrayElement(self._stats['repaid_orders'])[1]
        };

        return last;
    };

    /**
     * Returns account stats
     */
    self.getAccountStats = function () {
        return self._accountStats;
    };

    /**
     * Returns static distribution values
     * @returns {null|*}
     */
    self.getStatsDistribution = function () {
        return self._statsDistribution;
    };

    /**
     * Returns points groups
     */
    self.getPointsGroups = function () {
        return self._pointGroups;
    };

    /**
     * Get roles
     */
    self.getRoles = function () {
        return self._roles;
    };

    /**
     * Filter data by property values (obj - {Object : foo}, prop - string'', values = Array[])
     * @param obj
     * @param prop
     * @param values
     * @returns {{queue: Array, values: {}}}
     */
    self.filterDataValuesByProp = function (obj, prop, values) {
        var result = {
            queue   : [],
            values  : {}
        };

        $.each(obj['queue'], function (key, id) {
            if ($.inArray(obj['values'][id][prop], values) != -1) {
                result['queue'].push(id);
                result['values'][id] = obj['values'][id];
            }
        });

        return result;
    };
};