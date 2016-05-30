/**
 * User singleton
 */
T.System.User = new function () {
    var self = this;

    self.loggedIn = false;
    self.id = null;
    self.phone = null;
    self.name = null;
    self.surname = null;
    self.middlename = null;
    self.FIO = null;
    self.role = null;
    self.roleTitle = null;
    self.roles = null;
    self.sid = null;
    self.duration = null;

    self.balance = null;
    self.autoPrice = null;
    self.manPrice = null;
    self.singleRole = null;

    /**
     * Init user
     * @param response
     */
    self.init = function (response) {
        var user, currentRole;

        response = $(response);
        user = response.find('user');
        currentRole = response.find('current_role');

        self.loggedIn = false;

        self.sid = response.find('sid').attr('value');
        self.duration = parseInt(response.find('sid').attr('duration'));
        self.id = user.attr('id');
        self.phone = user.attr('phone');
        self.name = user.attr('name');
        self.surname = user.attr('surname');
        self.middlename = user.attr('middlename');
        self.FIO = self.surname + ' ' +
                   self.name.charAt(0).toUpperCase() + '.' +
                   self.middlename.charAt(0).toUpperCase() + '.';

        if (user.find('role').length == 1)
        {
            self.singleRole = true;
            self.roleId = user.find('role').attr('id');
            self.role = user.find('role').attr('name');
            self.roleTitle = user.find('role').attr('title');
        }
        else
        {
            self.singleRole = false;
            self.roles = {};

            $.each(user.find('role'), function(key, value) {
                self.roles[$(value).attr('id')] = {};
                self.roles[$(value).attr('id')]['id'] = $(value).attr('id');
                self.roles[$(value).attr('id')]['title'] = $(value).attr('title');
                self.roles[$(value).attr('id')]['name'] = $(value).attr('name');
            });
        }

        if (currentRole.length) {
            currentRole = currentRole.find('role');

            self.roleId = currentRole.attr('id');
            self.roleTitle = currentRole.attr('title');
            self.role = currentRole.attr('name');
        }

        self.balance = user.attr('balance');
        self.autoPrice = user.attr('auto_point_price');
        self.manPrice = user.attr('man_point_price');

        if (!self.id || !self.sid || !self.phone)
        {
            T.System.UI.showMessage('Ошибка аутентификации!');
            throw 'Ошибка аутентификации!';
        }

        self.loggedIn = true;
    };

    /**
     * Check the user is loginned
     */
    self.loginned = function () {
        return self.loggedIn;
    };

    /**
     * Remember login info
     * @param sid
     * @param roleId
     */
    self.rememberUser = function () {
        var duration;

        if (self.loginned()) {
            duration = new Date();
            duration.setTime(duration.getTime() + T.System.User.duration * 1000);
            $.cookie('sid', T.System.User.sid, { expires : duration });
            $.cookie('role_id', T.System.User.roleId, { expires : duration });
        } else {
            T.System.errorLog('T.System.User: User is not loginned!')
        }
    };
};
