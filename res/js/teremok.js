/**
 * Teremok global namespace
 */
var T = new function () {
    var self = this;

    /**
     * Init application
     */
    self.init = function () {
        T.Vocabularies.init();
        T.Managers.ResourcesManager.init();
        T.Templates.init(function () {
            T.System.Router.init();
        });
    };
};

$(function () {
    T.init();
});
