/**
 * AJAX functions
 */
T.System.Server.AJAX = new function () {
    var self = this;

    /**
     * Send AJAX request
     * @param url
     * @param method
     * @param data
     * @param dataType
     * @param successCallback
     * @param errorCallback
     */
    self.send = function (url, method, data, dataType, successCallback, errorCallback) {
        T.System.log('T.System.Server.AJAX.send:', url, data);

        if (dataType != 'html') {
            T.UI.showLoading();
        }

        $.ajax({
            type	 : method,
            url		 : url,
            data 	 : data,
            dataType : dataType,

            success : function (response) {
                T.UI.hideLoading();

                if (dataType == 'html')
                    T.System.log('T.System.Server.AJAX.send - success: response skipped');
                else
                    T.System.log('T.System.Server.AJAX.send - success:', response);

                if (successCallback)
                    successCallback(response);
            },

            error : function (response) {
                T.System.log('T.System.Server.AJAX.send - error:', response);

                if (errorCallback)
                    errorCallback(response);
            }
        });
    };

    /**
     * Send command to server
     * @param cmd
     * @param parameters
     * @param successCallback
     * @param errorCallback
     */
    self.command = function (cmd, parameters, successCallback, errorCallback) {
        var data;

        data = {
            'cmd' : cmd
        };

        for (var param in parameters)
            data[param] = parameters[param];

        if (T.System.User.loggedIn)
            data['sid'] = T.System.User.sid;

        self.send(
            T.System.Config.GATEWAY_URL,
            'POST',
            data,
            'xml',

            function (response) {
                var command, status;

                command = $(response).find('x');

                if (command.length == 0)
                {
                    T.System.log('T.Server.AJAX.command - invalid response');
                    self._onProtocolError(response, errorCallback);

                    return;
                }

                status = $(response).find('x').attr('status');

                if (status != '200')
                {
                    T.System.log('T.Server.AJAX.command - invalid status:', status);
                    self._onProtocolError(response, errorCallback);

                    return;
                }

                if (successCallback)
                {
                    try
                    {
                        successCallback(response);
                    }
                    catch (e)
                    {
                        T.System.log('T.System.Server.AJAX.command - callback exception');

                        throw e;
                    }
                }
            }
        );
    };

    /**
     * Get view by page name
     * @param page
     */
    self.getView = function (page, successCallback, errorCallback) {
        var data;

        self.send(
            page,
            'GET',
            {
                version : T.System.getVersion()
            },
            'html',

            function (response) {
                if (successCallback)
                {
                    try
                    {
                        successCallback(response);
                    }
                    catch (e)
                    {
                        T.System.log('T.System.Server.AJAX.getView - callback exception');
                        throw e;
                    }
                }
            },
            function (response) {
                if (errorCallback) {
                    errorCallback();
                }
            }
        );
    };

    /**
     * Handle protocol error
     */
    self._onProtocolError = function (response, errorCallback) {
        var cmd, message;

        cmd = $(response).find('x').attr('cmd');
        message = $(response).find('x').find('system').text();

        if (message == 'Param invalid: phone' && cmd == 'users.users_auth')
        {
            T.System.log('Пользователь с данным номером телефона не найден!');
        }
        else
        {
            T.System.log(message);
        }

        if (errorCallback)
            errorCallback(response);
    };

    /**
     * Handle not found error
     * @private
     */
    self._notFoundError = function (response, errorCallback) {
        T.System.UI.showMessage('Page not found!');

        if (errorCallback) {
            errorCallback();
        }
    };
};
