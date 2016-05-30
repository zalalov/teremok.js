/**
 * Basic image element
 * @param id
 * @constructor
 */
T.UI.Preview = function (el) {
    var self = this;

    T.UI.Image.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        if (self.hasClass(T.Managers.ResourcesManager.OPEN_DIALOG_CLASS)) {
            self.click(function () {
                var viewPhotosDialog = T.Managers.ResourcesManager.getViewPhotosDialog();

                if (!viewPhotosDialog) {
                    T.System.errorLog('T.UI.Preview.click: Can\'t find \'view-photos\' dialog');
                    return;
                }

                viewPhotosDialog.insertImage(self);
            });
        }
    };

    self.init();
};

/**
 * Inheritance from Image
 * @type {prototype|*}
 */
T.UI.Preview.prototype = Object.create(T.UI.Image.prototype);