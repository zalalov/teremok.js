/**
 * Basic link element
 * @param id
 * @constructor
 */
T.UI.Link = function (el) {
    var self = this;

    T.UI.BasicElement.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        if (self.hasClass(T.Managers.ResourcesManager.EXIT_LINK_CLASS)) {
            self.exitLink();
        }

        if (self.hasClass(T.Managers.ResourcesManager.BACK_TO_LIST_CLASS)) {
            self.click(self.backToList);
        }
    };

    self.init();
};

T.UI.Link.prototype = Object.create(T.UI.BasicElement.prototype);

T.UI.Link.prototype.backToList = function () {
    history.back();
};