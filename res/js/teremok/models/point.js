/**
 * Point model
 */

T.Models.Point = new function()
{
    var self = this;

    self.voc = null;

    self.COMMAND_REBOOT = 'reboot';
    self.COMMAND_SSH_OPEN = 'sshOpen';
    self.COMMAND_SSH_CLOSE = 'sshClose';

    /**
     * Initing point model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse response's point element
     * @param response
     */
    self.parse = function (response) {
        var point, tariffs, paid_until_date, pointTariffs, id, activationAt, expirationAt, frozenAt;
        var response = $(response);

        id = response.attr('id');
        tariffs = response.find('tariff');

        point = {};
        point['user_id'] = response.attr('user_id');
        point['group_id'] = response.attr('group_id');
        point['point_type'] = response.attr('point_type');
        point['status'] = response.attr('status');
        point['phone'] = response.attr('phone');
        point['amount_in'] = response.attr('amount_in') || self.voc.tWord('no_data');
        point['amount_out'] = response.attr('amount_out') || self.voc.tWord('no_data');
        point['address'] = response.attr('address') || self.voc.tWord('no_data');
        point['status_name'] = response.attr('status_name') || self.voc.tWord('no_data');
        point['point_status'] = response.attr('point_status');
        point['work_days'] = response.attr('work_days') || self.voc.tWord('no_data');
        point['work_hours'] = response.attr('work_hours') || self.voc.tWord('no_data');
        point['work_days_type'] = response.attr('work_days_type');
        point['is_blocked'] = response.attr('is_blocked');
        point['is_prolonged'] = response.attr('is_prolonged');
        point['paid_until_date'] = response.attr('paid_until_date');
        point['soft_version'] = response.attr('soft_version') || self.voc.tWord('no_data');
        point['update_soft_version'] = response.attr('update_soft_version') || self.voc.tWord('no_data');
        point['command'] = response.attr('command');
        point['softVersionsEquals'] = (point['update_soft_version'] == point['soft_version']) ? 1 : 0;
        point['is_prolonged'] = response.attr('is_prolonged');
        point['webcam_photo'] = response.attr('webcam_photo');
        point['webcam_passport'] = response.attr('webcam_passport');
        point['is_repay_enabled'] = response.attr('is_repay_enabled');
        point['is_loan_enabled'] = response.attr('is_loan_enabled');
        point['is_binded'] = response.attr('is_binded');
        point['comment'] = response.attr('comment');

        activationAt = Date.parse(response.attr('activation_at'));

        point['activation_at'] = activationAt ? new Date(activationAt).format('dd.mm.yyyy HH:MM:ss') : self.voc.tWord('no_data');

        expirationAt = Date.parse(response.attr('expiration_at'));

        point['expiration_at'] = expirationAt ? new Date(expirationAt).format('dd.mm.yyyy HH:MM:ss') : self.voc.tWord('no_data');

        paid_until_date = (new Date(response.attr('paid_until_date'))).getTime();

        if (paid_until_date >= (new Date()).getTime())
        {
            point['activated'] = true;
        }
        else
        {
            point['activated'] = false;
        }

        point['tariffs'] = {
            queue   : [],
            values  : {}
        };

        if (tariffs.size()) {
            $.each(tariffs, function(key, value) {
                var id = $(value).attr('id');

                point['tariffs']['queue'].push(id);
                point['tariffs']['values'][id] = T.Models.Tariff.parse(value);
            });
        }

        frozenAt = Date.parse(response.attr('frozen_at'));

        point['frozen_at'] = frozenAt ? new Date(frozenAt).format('dd.mm.yyyy HH:MM:ss') : self.voc.tWord('no_data');

        point['id'] = id;
        point['dateTimeNotSetUp'] = (point['work_days'] == self.voc.tWord('no_data') &&
            point['work_hours'] == self.voc.tWord('no_data'));
        point['is_binded'] = response.attr('is_binded');
        point['auto_renewal'] = response.attr('auto_renewal');

        if (!point['dateTimeNotSetUp']) {
            point['schedule'] = T.Utils.dateReduction(point['work_days']) + ' ' + point['work_hours'];
        }

        if (point['activated']) {
            point['license'] = new Date(point['paid_until_date']).format(dateFormat.masks.isoDate);
        }

        if (point['work_days'] != self.voc.tWord('no_data')) {
            point['work_days_arr'] = point['work_days'];
        } else {
            point['work_days_arr'] = ' ';
        }

        if (point['work_hours'] != self.voc.tWord('no_data')) {
            var time = point['work_hours'].split(' - ');
            var beginTime = time[0].split(':');
            var endTime = time[1].split(':');

            point['hour_begin'] = beginTime[0];
            point['min_begin'] = beginTime[1];
            point['hour_end'] = endTime[0];
            point['min_end'] = endTime[1];
        } else {
            point['work_hours'] = ' ';
        }

        return point;
    };
};