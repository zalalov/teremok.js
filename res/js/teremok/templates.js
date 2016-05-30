/**
 * Role's templates
 */

T.Templates = new function()
{
    var self = this;

    self._templates = null;

    self.TEMPLATES_DIR = 'templates/';
    self.TEMPLATES_FILENAME = 'templates.php';

    self.VIEWS_DIR = 'views';

    /**
     * Init Templates
     * @param callback
     */
    self.init = function(callback) {
        var timestamp, url, voc, t_response;

        voc = T.Vocabularies.getVocabulary();
        timestamp = new Date().getTime().toString();

        url = self.TEMPLATES_DIR + self.TEMPLATES_FILENAME;

        T.System.Server.AJAX.send(
            url,
            'GET',
            {
                timestamp : timestamp,
                version : T.System.getVersion()
            },
            'html',

            function(response) {
                t_response = T.Utils.translateHtml(response, voc);

                self._templates = $(t_response);

                if (callback) {
                    callback();
                }
            },

            function(response) {
                T.System.errorLog("T.Templates : There's no template with name: " + templateName);
            }
        );
    };

    /**
     * Inserts Templates into page
     * @param page
     * @returns {$|*|jQuery|HTMLElement}
     */
    self.insertTemplates = function(page) {
        var templateNodes, templateName, template, ins_page;
        ins_page = $(page);

        templateNodes= $(ins_page).find('.html_template');

        if (!self._templates || !templateNodes.length) {
            return page;
        }

        $.each(templateNodes, function(key, value) {
            templateName = $(value).attr('template_name');

            template = self.getTemplate(templateName);

            if (template.length) {
                $(value).replaceWith(template.html());

                T.System.log("T.Templates : Template '" + templateName + "' was inserted");
            } else {
                T.System.errorLog('T.Templates : Template : ' + templateName + ' - not found!');
            }
        });

        return ins_page;
    };

    /**
     * Returns templates
     * @returns {null|*}
     */
    self.getTemplates = function() {
        return self._templates;
    };

    /**
     * Returns Template by ID
     * @param templateId
     * @returns {Array|filter|*|filter|filter|filter}
     */
    self.getTemplate = function(templateId) {
        var template = self._templates.filter('#' + templateId);

        if (!template.length) {
            T.System.errorLog('T.Templates : Template not found: ' + templateId);
            return null;
        }

        template = self.insertTemplates(template);

        return template;
    };

    /**
     * Getting view by name
     * @param viewName
     */
    self.getView = function (viewName, callback) {
        var page;

        page = self.VIEWS_DIR + '/' + T.System.Router.getControllerName() + '/' + viewName + '.html';

        T.System.Server.AJAX.getView(
            page,

            function (response) {
                var page = self.insertTemplates(response);

                if (callback) {
                    callback(page);
                }
            },

            function (response) {
                T.System.errorLog('T.Templates : Page "' + page + '" not found!');
                return null;
            }
        );
    };
};
