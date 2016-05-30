/**
 * Styles manager
 */
T.Managers.StylesManager = new function () {
    var self = this;

    self.STYLES_DIR = 'res/themes/default/css/';

    self.BOOTSTRAP_3_0_0    = 'bootstrap-3.0.0.css';
    self.BOOTSTRAP_3_1_1    = 'bootstrap-3.1.1.css';
    self.BOOTSTRAP_THEME    = 'bootstrap-theme.css';
    self.IS_LOADING_LIB     = 'jquery.isLoading.css';
    self.COMMON             = 'common.css';

    self.STYLES_SCRIPT      = 'styles.php';

    /**
     * Load styles for
     */
    self.initStyles = function (callback) {
        var controller = T.System.Router.getControllerName();
        var body = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'body');
        var filenames = [];

        var bootstrap;
        var bootstrapTheme      = self.BOOTSTRAP_THEME;
        var common              = self.COMMON;

        self.clearStyles();

        // Bootstrap version
        switch (controller) {
            case T.Controllers.INSPECTOR_CONTROLLER:
            case T.Controllers.LOGIN_CONTROLLER:
                bootstrap = self.BOOTSTRAP_3_0_0;
                break;
            case T.Controllers.AGENT_CONTROLLER:
                bootstrap = self.BOOTSTRAP_3_1_1;
                break;
            default:
                T.System.errorLog('T.Managers.StylesManager: Controller not found: ' + controller);
                break;
        }

        filenames.push(bootstrap, common, controller + '.css');

        self.loadStyles(
            {
                filenames : filenames
            },
            function (response) {
                self.insertStyles(response);

                if (callback) {
                    callback();
                }
            }
        );
    };

    /**
     * Clear previous controller's styles
     */
    self.clearStyles = function () {
        $('head')
            .find("style")
            .remove();
    };

    /**
     * Insert styles into DOM's STYLE tag
     * @param styles
     */
    self.insertStyles = function (styles) {
        var style = $('<style>')
            .attr('type', 'text/css')
            .html(styles);

        $('head').append(style);
    };

    /**
     * Load styles
     * @param data
     * @param successCallback
     */
    self.loadStyles = function (data, successCallback) {
        T.System.Server.AJAX.send(
            self.STYLES_DIR + self.STYLES_SCRIPT,
            'POST',
            data,
            'html',
            function (response) {
                successCallback(response);
            }
        );
    };
};