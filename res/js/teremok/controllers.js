/**
 * Controllers namespace
 */
T.Controllers = new function () {
    var self = this;

    self.LOGIN_CONTROLLER       = 'login';
    self.INSPECTOR_CONTROLLER   = 'inspector';
    self.AGENT_CONTROLLER       = 'agent';

    self.controllersList = [
        self.LOGIN_CONTROLLER,
        self.INSPECTOR_CONTROLLER,
        self.AGENT_CONTROLLER
    ];
};