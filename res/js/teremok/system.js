/**
 * System namespace
 */
T.System = new function () {
    var self = this;

    self.repoVersion = null;
    self.errorsColor = '#FF0000';

    /**
     * Log function
     */
    self.log = function () {
        if (self.Config.DEBUG && console && console.log)
            console.log.apply(console, arguments);
    };

    /**
     * Error log function
     */
    self.errorLog = function (text) {
        self.log('%c' + text, 'color: ' + self.errorsColor);
    };

    /**
     * Setting up repo version
     * @param ver
     */
    self.setVersion = function(ver)
    {
        self.repoVersion = ver;
    };

    /**
     * Get repo version
     */
    self.getVersion = function()
    {
        return self.repoVersion;
    };
};