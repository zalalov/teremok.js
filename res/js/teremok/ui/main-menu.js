/**
 * Main menu class (header menu)
 * @param id
 * @constructor
 */
T.UI.MainMenu = function (el) {
    var self = this;

    self.menuItemClass = 'main-menu-item';

    T.UI.Menu.call(this, el);
};

T.UI.MainMenu.prototype = Object.create(T.UI.Menu.prototype);

/**
 * Init main menu
 */
T.UI.MainMenu.prototype.init = function () {
    var controller = T.System.Router.getController();
    var menu = this.getElement();

    menu.find('.' + this.menuItemClass).each(function (key, item) {
        $(item).click(function () {
            controller.openPage($(item).attr('page'), true);
        });
    });
};

/**
 * Selecte main menu item (find by page)
 * @param page
 */
T.UI.MainMenu.prototype.selectItem = function (page) {
    var menu = this.getElement();
    var item;

    if (!page) {
        T.System.errorLog('T.UI.MainMenu.selectItem: Param invalid: page');
        return;
    }

    item = menu.find('[page=' + page + ']');

    if (!item.length) {
        T.System.errorLog('T.UI.MainMenu: No menu item with page: ' + page);
        return;
    }

    item.siblings().removeClass('active');
    item.addClass('active');
};