/**
 * Client model
 */

T.Models.Client = new function() {
    var self = this;

    self.voc = null;

    /**
     * Initing client model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse 'client' response element
     * @param response
     * @returns client model object
     */
    self.parse = function (response) {
        var data, phones, responseSteps, stepName, step;

        data = {
            'id' : $(response).attr('id'),
            'surname' : $(response).attr('surname') || self.voc.tWord('no_data'),
            'name' : (response.attr('surname')) ? response.attr('name') : '',
            'middlename' : (response.attr('surname')) ? response.attr('middlename') : '',
            'created_at' : $(response).attr('created_at') || self.voc.tWord('no_data'),
            'sex' : $(response).attr('sex') || self.voc.tWord('no_data'),
            'birthday' : $(response).attr('birthday') || self.voc.tWord('no_data'),
            'terrorist' : parseInt($(response).attr('terrorist')),
            'orders_num' : $(response).attr('orders_num') || self.voc.tWord('no_data')
        };

        data['full_name'] = data['surname'] + ' ' + data['name'] + ' ' + data['middlename'];

        phones = $(response).find('phones').children();

        data['phones'] = {};

        $.each(phones, function(key, value) {
            data['phones'][key] = $(value).attr('value');
        });

        T.Utils.objLength(data['phones']) ? data['phone'] = data['phones'][0] : self.voc.tWord('no_data');

        responseSteps = $(response)
            .children('steps')
            .children();

        $.each(responseSteps, function(key, value) {
            stepName = $(value).attr('value');
            data[stepName] = T.Models.Step.parse(value);
        });

        // UI
        if (step = data[T.Models.Step.PASSPORT_PHOTO_STEP]) {
            data['birthday']               = step['birthday'];
            data['birthplace']             = step['birthplace'];
            data['passport_number']        = step['number'];
            data['passport_department']    = step['department'];
            data['passport_issue_place']   = step['issue_place'];
            data['passport_issue_date']    = step['issue_date'];
            data['passport_check_status']  = step['passport_check_status'];
        }

        if (step = data[T.Models.Step.PASSPORT_REG_STEP]) {
            data['address']        = step['address'];
            data['reg_date']       = step['reg_date'];
            data['reg_department'] = step['reg_department'];
        }

        if (step = data[T.Models.Step.INN_STEP]) {
            data['inn']                = step['inn'];
            data['inn_check_status']   = step['inn_check_status'];
        }

        if (step = data[T.Models.Step.JOB_STEP]) {
            data['job_company']    = step['company'];
            data['job_position']   = step['position'];
            data['job_phone']      = step['job_phone'];
            data['job_address']    = step['job_address'];
        }

        if (step = data[T.Models.Step.GUARANTOR_STEP]) {
            data['guarantor_name'] = step['name'];
            data['guarantor_phone'] = step['phone'];
        }

        if (step = data[T.Models.Step.FIXED_PHONE_STEP]) {
            data['fixed_phone'] = step['phone'];
        }

        if (step = data[T.Models.Step.ACTUAL_ADDRESS_STEP]) {
            data['actual_address'] = step['adress'];
        }

        return data;
    };
};