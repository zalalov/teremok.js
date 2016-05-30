/**
 * Main container class (views pages)
 * @param id
 * @constructor
 */
T.UI.MainContainer = function (el) {
    var self = this;

    T.UI.Container.call(this, el);
};

T.UI.MainContainer.prototype = Object.create(T.UI.Container.prototype);

/**
 * Open page by inserting template
 * @param pageName
 */
T.UI.MainContainer.prototype.openPage = function (pageName) {
    var template = T.Templates.getTemplate(pageName);
    template = $(template.html());

    var page = new T.UI.Page(template);
    page.fill();

    this.insert({ template : page, newState : true });
};