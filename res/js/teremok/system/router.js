/**
 * Router singleton
 */
T.System.Router = new function () {
    var self = this;

    self._mainBlock = null;
    self._currentController = null;

    self.VIEWS_DIR = 'views';
    self._controllerName = null;

    self._controllers = null;

    /**
     * Init router
     */
    self.init = function (callback)
    {
        self._mainBlock = $('#main');
        self._page = 0;

        T.System.History.init();
        T.System.History.parseURI(location.hash);

        self.parseDOM();

        self.open('index');

        if (callback) {
            callback();
        }
    };

    /**
     * Init models
     */
    self.initModels = function () {
        $.each(T.Models, function (key, model) {
            if (model.init) {
                model.init();
            }
        });
    };

    /**
     * Load page by name & saving state
     * @param page
     */
    self.open = function (page) {
        var cookies = self.cookies();

        if (cookies && !T.System.User.loginned()) {
            self.autologin(cookies['sid'], cookies['role_id']);
        } else {
            T.System.Router.setController();

            T.Templates.getView(page, function (view) {
                var body = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'body');
                body.invisible();

                var page = new T.UI.Page($(view));
                page.fill();

                T.Managers.StylesManager.initStyles(function () {
                    body.insert({ template : page });

                    // Open controller && set logo only after inserting template for it
                    T.Utils.setLogo();
                    self.getController().open();
                    body.visible();
                });
            });
        }
    };

    /**
     * Reload page
     */
    self.reload = function () {
        location.reload();
    };

    /**
     * Parse all DOM elements to resources
     * @param response
     */
    self.parseDOM = function (response) {
        T.Managers.ResourcesManager.parse(response);
    };

    /**
     * Setting controller
     */
    self.setController = function() {
        var controller;

        if (!T.System.User.loginned()) {
            self._controllerName = T.Controllers.LOGIN_CONTROLLER;
        } else {
            self._controllerName = T.System.User.role;
        }

        controller = self._controllerName.charAt(0).toUpperCase() + self._controllerName.slice(1);

        if (T.Controllers[controller]) {
            self._currentController = T.Controllers[controller];
        } else {
            T.System.errorLog('T.System.Router.setControler: Can\'t find controller with name: ' + controller);
            self._currentController = null;
        }
    };

    /**
     * Jump to the main page
     */
    self.toMainPage = function () {
        T.Controllers.Login.open();
    };

    /**
     * Returns current controller
     */
    self.getController = function ()
    {
        return self._currentController;
    };

    /**
     * Returns current controller name
     */
    self.getControllerName = function () {
        return self._controllerName;
    };

    /**
     * Try autologin
     */
    self.autologin = function (sid, roleId) {
        T.System.Server.AJAX.command('users.check_session_state',
            {
                'sid' : sid,
                'role_id' : roleId
            },
            function(response) {
                var response = $(response);

                T.System.User.init(response);

                T.System.Router.initModels();
                T.System.Router.open('index');
            },
            function() {}
        );
    };

    /**
     * Check saved cookies
     */
    self.cookies = function () {
        var sid, roleId, cookies;

        sid = $.cookie('sid');
        roleId = $.cookie('role_id');

        if (sid && roleId) {
            var cookies = {};

            cookies['sid'] = sid;
            cookies['role_id'] = roleId;

            return cookies;
        }

        return null;
    };
};