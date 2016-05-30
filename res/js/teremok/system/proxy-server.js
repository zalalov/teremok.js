/**
 * Connection to proxy server
 * @param controller
 * @constructor
 */
T.System.ProxyServer = function (controller) {
    var self = this;

    self.ws = null;
    self._connected = null;
    self._controller = controller;

    self.fping = false;
    self.pingInterval = null;
    self.pingSendingInterval = 30000;
    self.pingRequestWaitingInterval = 5000;

    self.onlineState = 'online';
    self.offlineState = 'online';

    /**
     * On proxy server connection open
     * @private
     */
    self._onOpen = function () {
        self.sendCommand('<x cmd="user.login" user_id="' + T.System.User.id + '"  role="' + T.System.User.role + '" sid="' + T.System.User.sid + '" />');

        T.System.log("T.System.ProxyServer: Socket connection opened...");
        self.openProxyConnection();
    };

    /**
     * On proxy server connection close
     * @private
     */
    self._onClose = function () {
        T.System.log("T.System.ProxyServer: Socket connection closed...");
        self.closeProxyConnection();
    };

    /**
     * On proxy server connection error
     * @private
     */
    self._onError = function () {
        T.System.errorLog("T.System.ProxyServer: Socket connection closed by error...");
        self.closeProxyConnection();
    };

    /**
     * On proxy server message
     * @private
     */
    self._onMessage = function (evt) {
        T.System.log("T.System.ProxyServer: Message : ", evt.data);
        self.handleMessage($(evt.data));
    };

    /**
     * Proxy server message handler
     * @param message
     */
    self.handleMessage = function (message) {
        var cmd, messageHandlers;

        messageHandlers = {
            'user.login'  : function (data)
            {
                if (data.attr('status') != 200)
                {
                    self.ws.close();
                }
            },
            'inspector.accept' : function (data) {
                if (data.attr('status') != 200) {
                    //TODO: invalid status dialog
                }

                self.stopPinging();
            },
            'order.proxy' : function () {},

            'order.apply' : function (data) {
                if (!self.orderProcessing)
                {
                    var orderId = data.attr('order_id');

                    if (!orderId)
                    {
                        T.UI.alert(self.voc.tWord('update_error'));
                        return;
                    }

                    self._controller.newOrder(orderId);
                }
            },

            'order.canceled' : function (data) {
                //TODO: make 'cancel by user dialog handling'
            },

            'socket.ping' : function (data) {
                self.fping = true;
            }
        };

        cmd = message.attr('cmd');

        if (!cmd || !(cmd in messageHandlers))
        {
            T.UI.alert(self.voc.tWord('update_error') + ' ' + cmd);
            return;
        }

        messageHandlers[cmd](message);
    };

    self.connect = function(id)
    {
        if (self.ws != null)
        {
            self.ws.close();
        }

        self.ws = new WebSocket("ws://" + location.host + ":10000/somerequest");

        self.ws.onopen = function () {
            self._onOpen();
        };

        self.ws.onclose = function () {
            self._onClose();
        };

        self.ws.onerror = function () {
            self._onError();
        };

        self.ws.onmessage = function (evt) {
            self._onMessage(evt);
        };
    };

    /**
     * Send command to proxy
     */
    self.sendCommand = function(command)
    {
        T.System.log("T.System.ProxyServer: Sending Message:", command);
        self.send(command);
    };

    self.send = function (command) {
        T.System.log('T.System.ProxyServer (send): ', command);

        if (self.ws) {
            self.ws.send(command);
        }
    };

    /**
     * Build message
     */
    self.buildMessage = function (data) {
        var message = $('<x>');

        $.each(data, function (key, value) {
            message.attr(key, value);
        });

        message = $('<div>').append(message).html();

        return message;
    };

    /**
     * Close proxy connection
     */
    self.closeProxyConnection = function () {
        self.stopPinging();

        if (self.ws) {
            self.ws.close();
            self.ws = null;
        }

        self._connected = false;
        self._controller.proxyConnectionLost();
    };

    /**
     * Open proxy connection
     */
    self.openProxyConnection = function () {
        self._connected = true;
        self.startPinging();
        self.changeState(self.onlineState);
    };

    /**
     * Stopp ping sending
     */
    self.stopPinging = function () {
        if (self.pingInterval) {
            clearInterval(self.pingInterval);
        }
    };

    /**
     * Start sending ping command
     */
    self.startPinging = function () {
        if (self.pingInterval)
            clearInterval(self.pingInterval);

        var message = {
            cmd : 'socket.ping'
        };
        message = self.buildMessage(message);

        self.pingInterval = setInterval(function() {
            self.fping = false;
            self.sendCommand(message);

            setTimeout(function() {
                if (!self.fping)
                {
                    self.stopPinging();
                    self._controller.proxyConnectionLost();
                }
            }, self.pingRequestWaitingInterval);
        }, self.pingSendingInterval);
    };

    /**
     * Returns connection state
     * @returns {null|*}
     */
    self.isConnected = function () {
        return self._connected;
    };

    /**
     * Change connection state
     * @param state
     */
    self.changeState = function (state) {
        var indicator = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INDICATOR_TYPE, 'connection_indicator');

        switch (state) {
            case self.onlineState:
                indicator.online();
                break;
            case self.offlineState:
                indicator.offline();
            default:
                break;
        }
    };
};