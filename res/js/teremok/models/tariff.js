/**
 * Tariff model
 */

T.Models.Tariff = new function()
{
    var self = this;

    self.voc = null;

    /**
     * Initing tariff models
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse 'tariff' response element
     * @param response
     * @returns tariff model object
     */
    self.parse = function (response) {
        var tariff, activationAt, finishingAt;
        var response = $(response);

        tariff = {
            'name' : response.attr('name') || self.voc.tWord('no_data'),
            'amount_min' : response.attr('amount_min'),
            'amount_max' : response.attr('amount_max'),
            'rate' : response.attr('rate'),
            'period_min' : response.attr('period_min'),
            'period_max' : response.attr('period_max'),
            'penalty_fee' : response.attr('penalty_fee'),
            'penalty_rate' : response.attr('penalty_rate'),
            'penalty_period' : response.attr('penalty_period'),
            'fee' : response.attr('fee'),
            'skip_penalty_days' : response.attr('skip_penalty_days'),
            'skip_days' : response.attr('skip_days'),
            'fee_fixed' : response.attr('fee_fixed'),
            'penalty_fee_fixed' : response.attr('penalty_fee_fixed'),
            'final_penalty_fee' : response.attr('final_penalty_fee'),
            'id' : response.attr('id')
        };

        tariff['availible_amount'] = tariff['amount_min'] + ' - ' + tariff['amount_max'];
        tariff['availible_term'] = tariff['period_min'] + ' - ' + tariff['period_max'];

        activationAt = Date.parse(response.attr('activation_at'));

        tariff['date_from_to'] = '';

        if (activationAt) {
            tariff['activation_at'] = new Date(activationAt);
            tariff['activation_at_iso'] = tariff['activation_at'].format(dateFormat.masks.isoDate);
        } else {
            tariff['activation_at'] = self.voc.tWord('no_data');
            tariff['activation_at_iso'] = '';
        }

        finishingAt = Date.parse(response.attr('finishing_at'));

        if (finishingAt) {
            tariff['finishing_at'] = new Date(finishingAt);
            tariff['finishing_at_iso'] = tariff['finishing_at'].format(dateFormat.masks.isoDate);
        } else {
            tariff['finishing_at'] = self.voc.tWord('no_data');
            tariff['finishing_at_iso'] = '';
        }

        if (activationAt) {
            tariff['date_from_to'] = tariff['activation_at'].format(dateFormat.masks.russianDate);

            if (finishingAt) {
                tariff['date_from_to'] += ' - ' + tariff['finishing_at'].format(dateFormat.masks.russianDate);
            }
        }

        if (parseInt(tariff['fee_fixed']) == 1) {
            tariff['fee_fixed_check'] = 'checked="checked"';
        } else {
            tariff['fee_fixed_check'] = '';
        }

        if (parseInt(tariff['penalty_fee_fixed'] == 1)) {
            tariff['penalty_fee_fixed_check'] = 'checked="checked"';
        } else {
            tariff['penalty_fee_fixed_check'] = 'checked="checked"';
        }

        return tariff;
    };
};
