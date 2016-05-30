/**
 * User model
 */

T.Models.User = new function()
{
    var self = this;

    self.voc = null;

    self.proxyRoles = null;

    /**
     * Initing transaction model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse response's user element
     * @param response
     */
    self.parse = function (response) {
        var user, roles;

        user = {
            'parent_user_id' : $(response).attr('parent_user_id'),
            'login' : $(response).attr('login'),
            'name' : (response.attr('surname')) ? response.attr('name') : '',
            'surname' : $(response).attr('surname') || self.voc.tWord('no_data'),
            'middlename' : (response.attr('surname')) ? response.attr('middlename') : '',
            'phone' : $(response).attr('phone'),
            'role' : $(response).attr('role'),
            'role_title' : $(response).attr('role_title'),
            'work_days' : $(response).attr('work_days') || self.voc.tWord('no_data'),
            'work_hours' : $(response).attr('work_hours') || self.voc.tWord('no_data'),
            'work_days_type' : $(response).attr('work_days_type'),
            'is_blocked' : $(response).attr('is_blocked'),
            'is_bindable' : $(response).attr('is_bindable'),
            'is_binded' : $(response).attr('is_binded'),
            'company' : $(response).attr('company') || self.voc.tWord('no_data'),
            'balance' : $(response).attr('balance'),
            'auto_point_price' : $(response).attr('auto_point_price'),
            'id' : $(response).attr('id'),
            'roles' : {},
            'pointsCount' : $(response).attr('points_count') ? $(response).attr('points_count') : 0
        };

        user['fio'] = user['surname'] + ' ' + user['name'] + ' ' + user['middlename'];

        if (user['work_days'] != self.voc.tWord['no_data']) {
            user['mode'] += user['work_days'];
        }

        if (user['work_days'] != self.voc.tWord['no_data']) {
            user['mode'] += user['work_hours'];
        }

        if (!user['mode']) {
            user['mode'] = self.voc.tWord('no_data');
        }

        user['dateTimeNotSetUp'] = user['work_days'] == self.voc.tWord('no_data') && user['work_hours'] == self.voc.tWord('no_data');

        user['roles'] = {
            queue   : [],
            values  : {}
        };

        var roles = $(response).find('role');

        $.each(roles, function(roleKey, roleValue) {
            var roleId = $(roleValue).attr('id');

            user['roles']['queue'].push(roleId);
            user['roles']['values'][roleId] = T.Models.Role.parse(response);
        });

        if (!user['dateTimeNotSetUp']) {
            user['schedule'] = T.Utils.dateReduction(user['work_days']) + ' ' + user['work_hours'];
        }

        return user;
    };
}
