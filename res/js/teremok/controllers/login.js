/**
 * Login controller
 */
T.Controllers.Login = new function () {
    var self = this;

    self._loginBlock = null;
    self._login = null;
    self._password = null;
    self._loginButton = null;
    self._regenLogin = null;
    self._regenCode = null;
    self._regenButton = null;
    self._langSelect = null;
    self._mainContainer = null;

    /**
     * Open controller
     */
    self.open = function () {
        var loginContainer, currentLanguage, languages, languagesContainer, cookies;
        self._mainContainer = 'login-container';

        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_CONTAINER_TYPE, self._mainContainer).openPage('login');

        // This is ONE resource
        languagesContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'languages_container');

        // This is already resources-list element (T.UI.ResourcesList)
        // Now we can bind 'click' event on 'resources-list' element (it will work on every element inside it)
        languages = languagesContainer.findByType('list-item');

        currentLanguage = languagesContainer.findByCustomFilter({ value : T.Vocabularies.getLanguage() });
        currentLanguage.first().setSelected();

        languages.click(function (resource) {
            var lang = resource.val();
            T.Vocabularies.setLanguage(lang);
            T.System.Router.reload();
            return;
        });

        self._loginButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'login_button');
        self._login = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INPUT_TYPE, 'login_enter_field');
        self._password = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INPUT_TYPE, 'password_enter_field');

        self._password.keypress(function(e) {
            if (e.keyCode == 13)
            {
                e.preventDefault();
                self._loginButton.trigger('click');
            }
        });

        self._loginButton.click(self._onLoginClick);
    };

    /**
     * Close controller
     */
    self.close = function () {
        self._loginBlock.hide().remove();
    };

    /**
     * Clicking "enter" button
     * @private
     */
    self._onLoginClick = function () {
        var login, password, lang, status;
        var loginContainer;

        login = self._login.val();
        password = self._password.val();
        loginContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'login_block');

        loginContainer.removeLoginErrors();

        self._loginButton.disable();

        self.login(login, password);

    };

    /**
     * Send login command
     * @param login
     * @param password
     * @param callback
     */
    self.login = function (login, password, callback) {
        T.System.Server.AJAX.command(
            'users.login',
            {
                'login' : login,
                'pass' :  password
            },

            function (response) {
                T.System.User.init(response);

                $.cookie('lang', self._currentLanguage, { expires : 365 });

                T.System.User.rememberUser();
                T.System.Router.initModels();
                T.System.Router.open('index');
            },

            function (response) {
                var loginContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'login_block');
                loginContainer.setLoginErrors();
            }
        );
    };

    /**
     * Clear login cookies
     */
    self.clearLoginData = function () {
        $.cookie('sid', null, { expires : -100 });
        $.cookie('role_id', null, {expires : -100});
    };

    /**
     * Logout action
     */
    self.logout = function () {
        self.clearLoginData();
        T.System.Router.reload();
    };
};

/**
 * Set login form fields as error
 */
T.UI.Container.prototype.setLoginErrors = function () {
    this.find('login_enter_field').addError();
    this.find('password_enter_field').addError();
    this.find('login_button').enable();
};

/**
 * Remove errors of login form fields
 */
T.UI.Container.prototype.removeLoginErrors = function () {
    this.find('login_enter_field').removeError();
    this.find('password_enter_field').removeError();
};

/**
 * Sets this button as exit button
 */
T.UI.Link.prototype.exitLink = function () {
    this.click(T.Controllers.Login.logout);
};