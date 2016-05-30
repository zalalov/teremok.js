/**
 * Role model
 */

T.Models.Role = new function()
{
    var self = this;

    self.AGENT_ROLE = 'agent';
    self.ADMIN_ROLE = 'admin';
    self.GOD_ROLE = 'god';
    self.ACCOUNTANT_ROLE = 'accountant';
    self.LAWYER_ROLE = 'lawyer';
    self.COLLECTOR_ROLE = 'collector';
    self.INSPECTOR_ROLE = 'inspector';
    self.OPERATOR_ROLE = 'operator';
    self.SUPPORT_ROLE = 'support';
    self.TECH_ROLE = 'tech';
    self.MAIN_ACCOUNTANT_ROLE = 'main-accountant';

    /**
     * Initing role model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };


    /**
     * Parse response's role element
     * @param response
     */
    self.parse = function (response) {
        var role, response = $(response);

        role = {
            title   : response.attr('title'),
            name    : response.attr('name'),
            id      : response.attr('id')
        };

        return role;
    };
};
