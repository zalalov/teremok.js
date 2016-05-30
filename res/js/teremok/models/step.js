/**
 * Step model
 */

T.Models.Step = new function () {
    var self = this;

    self.voc = null;

    self.PASSPORT_FIRST_STEP = 'passport-first';
    self.PASSPORT_PHOTO_STEP = 'passport-photo';
    self.PASSPORT_REG_STEP = 'passport-reg';
    self.PHOTO_STEP = 'photo';
    self.FINGERPRINT_STEP = 'fingerprint';
    self.SIGNATURE_STEP = 'signature';
    self.INN_STEP = 'inn';
    self.JOB_STEP = 'job';
    self.GUARANTOR_STEP = 'guarantor';
    self.FIXED_PHONE_STEP = 'fixed-phone';
    self.ACTUAL_ADDRESS_STEP = 'actual-address';
    self.SECOND_DOCUMENT_STEP = 'second-document';

    /**
     * Initing step model
     */
    self.init = function ()  {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse response's step element
     * @param response
     */
    self.parse = function(response) {
        var step = {};

        switch ($(response).attr('value'))
        {
            case self.PASSPORT_FIRST_STEP:
                step = {};
                break;
            case self.PASSPORT_PHOTO_STEP:
                var responsePassport = $(response).find('passport');

                step = {};

                step['surname'] = responsePassport.find('surname').attr('value');
                step['name'] = responsePassport.find('name').attr('value');
                step['middlename'] = responsePassport.find('middlename').attr('value');
                step['sex'] = responsePassport.find('sex').attr('value');

                var birthday = Date.parse(responsePassport.find('birthday').attr('value'));

                step['birthday'] = birthday ? new Date(birthday).format('dd.mm.yyyy') : null;
                step['birthplace'] = responsePassport.find('birthplace').attr('value');
                step['number'] = responsePassport.find('number').attr('value');
                step['department'] = responsePassport.find('department').attr('value');
                step['issue_place'] = responsePassport.find('issue_place').attr('value');

                var passportIssueDate = Date.parse(responsePassport.find('issue_date').attr('value'));

                step['issue_date'] = passportIssueDate ? new Date(passportIssueDate).format('dd.mm.yyyy') : null;
                step['passport_check_status'] = responsePassport.find('passport_check_status').attr('value');
                break;
            case self.PASSPORT_REG_STEP:
                var responsePassport = $(response).find('passport');

                step = {};

                step['country'] = responsePassport.find('country').attr('value');
                step['city'] = responsePassport.find('city').attr('value');
                step['address'] = responsePassport.find('address').attr('value');

                var passportRegDate = Date.parse(responsePassport.find('reg_date').attr('value'));

                step['reg_date'] = passportRegDate ? new Date(passportRegDate).format('dd.mm.yyyy') : self.voc.tWord('no_data');
                step['reg_department'] = responsePassport.find('reg_department').attr('value');
                break;
            case self.PHOTO_STEP:
                step = {};
                break;
            case self.FINGERPRINT_STEP:
                step = {};
                break;
            case self.SIGNATURE_STEP:
                step = {};
                break;
            case self.INN_STEP:
                var responseInn = $(response).find('inn');

                step = {};

                step['inn'] = responseInn.attr('value');
                step['inn_check_status'] = responseInn.attr('inn_check_status');
                break;
            case self.JOB_STEP:
                var job = $(response).find('job');

                step = {};

                step['company'] = job.find('company').attr('value');
                step['position'] = job.find('position').attr('value');
                step['phone'] = job.find('phone').attr('value');
                step['address'] = job.find('address').attr('value');
                break;
            case self.GUARANTOR_STEP:
                var guarantor = $(response).find('guarantor');

                step = {};

                step['name'] = guarantor.find('name').attr('value');
                step['phone'] = guarantor.find('phone').attr('value');
                break;
            case self.FIXED_PHONE_STEP:
                var fixedPhone = $(response).find('fixed_phone');

                step = {};

                step['phone'] = fixedPhone.find('phone').attr('value');
                break;
            case self.ACTUAL_ADDRESS_STEP:
                var actualAddress = $(response).find('actual_address');

                step = {};

                step['address'] = actualAddress.find('address').attr('value');
                break;
            case self.SECOND_DOCUMENT_STEP:
                step = {};
                break;
            default:
                T.System.errorLog('Unknown step: ' + $(response).attr('value'));
                step = null;
                break;
        }

        return step;
    };
};