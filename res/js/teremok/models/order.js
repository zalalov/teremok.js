/**
 * Order model
 */
T.Models.Order = new function () {
    var self = this;

    self.voc = null;

    self.PROCESSING_STEP_COUNT = null;

    self.PROCESSING_STEP_STATUS_NO_DATA = 0;
    self.PROCESSING_STEP_STATUS_READY = 1;
    self.PROCESSING_STEP_STATUS_REPEAT = 2;
    self.PROCESSING_STEP_STATUS_PROCESSED = 9;

    self.PASSPORT_PROCESSED = 20;
    self.PASSPORT_ERROR = 100;

    self.ID_STATUS_NOT_PROCESSED = 0;
    self.ID_STATUS_PROCESSING    = 1;
    self.ID_STATUS_OK            = 2;
    self.ID_STATUS_ERROR         = 3;
    self.ID_STATUS_INVALID       = 4;

    // statuses
    self.STATUS_REJECTED               = -10;   // rejected by operator or inspector
    self.STATUS_CANCELLED_BY_CLIENT    = -5;    // cancelled by client
    self.STATUS_NEW                    = 0;     // new order
    self.STATUS_PROCESSING             = 1;     // operator is processing the order
    self.STATUS_PROCESSED              = 10;    // order is processed
    self.STATUS_REVIEWING              = 11;    // inspector is reviewing the order
    self.STATUS_APPROVED               = 100;   // order is fully approved
    self.STATUS_PAID                   = 200;   // order is paid
    self.STATUS_EXPIRED                = 500;   // order is expired
    self.STATUS_PENALTY_PERIOD_EXPIRED = 550;   // penalty period expired
    self.STATUS_TO_COURT               = 600;   // order is transferred to court
    self.STATUS_SCHEDULED_TRIAL_DATE   = 610;   // order has a scheduled trial date
    self.STATUS_COURT_DECISION         = 620;   // we have a court decision regarding this case
    self.STATUS_EXECUTION_LIST         = 630;   // got execution list
    self.STATUS_EXECUTION              = 640;   // the case in the execution stage
    self.STATUS_CLOSED                 = 999;   // order is closed

    self.successStatuses = [
        self.STATUS_NEW,
        self.STATUS_PROCESSING,
        self.STATUS_PROCESSED,
        self.STATUS_REVIEWING,
        self.STATUS_APPROVED,
        self.STATUS_PAID,
        self.STATUS_CLOSED
    ];

    self.unSuccessStatuses = [
        self.STATUS_REJECTED,
        self.STATUS_CANCELLED_BY_CLIENT,
        self.STATUS_EXPIRED,
        self.STATUS_PENALTY_PERIOD_EXPIRED,
        self.STATUS_TO_COURT,
        self.STATUS_SCHEDULED_TRIAL_DATE,
        self.STATUS_COURT_DECISION,
        self.STATUS_EXECUTION_LIST,
        self.STATUS_EXECUTION
    ];

    self.statusesTranslates = null;

    self.INVALID_ORDER_STATUS = '405';

    /**
     * Initing order model
     */
    self.init = function() {
        self.voc = T.Vocabularies.getVocabulary();

        self.statusesTranslates =
        {
            '-10' : self.voc.tWord('refused'),
            '-5'  : self.voc.tWord('canceled_by_client'),
            '0'   : self.voc.tWord('new'),
            '1'   : self.voc.tWord('processing'),
            '10'  : self.voc.tWord('processed'),
            '11'  : self.voc.tWord('pending'),
            '100' : self.voc.tWord('approved'),
            '200' : self.voc.tWord('disbursed'),
            '500' : self.voc.tWord('overdue'),
            '550' : self.voc.tWord('completed_penalty_period'),
            '600' : self.voc.tWord('refered_to_the_court'),
            '610' : self.voc.tWord('court_date_dest'),
            '620' : self.voc.tWord('receive_result_of_court_processing'),
            '630' : self.voc.tWord('obtained_execution_list'),
            '640' : self.voc.tWord('enforcement_proceedings'),
            '999' : self.voc.tWord('closed')
        };
    };

    self.getData = function()
    {
        return self;
    };

    /**
     * Parse 'order' response element
     * @param response
     * @returns order model object
     */
    self.parse = function(response) {
        var data, createdAt, stepName, responseSteps, finishingAt, step;

        data = {
            'phone' : response.attr('phone') || self.voc.tWord('no_data'),
            'surname' : response.attr('surname') || self.voc.tWord('no_data'),
            'name' : (response.attr('surname')) ? response.attr('name') : '',
            'middlename' : (response.attr('surname')) ? response.attr('middlename') : '',
            'amount' : response.attr('amount'),
            'accrued_interest' : response.attr('accrued_interest'),
            'birthday' : response.attr('birthday') || self.voc.tWord('no_data'),
            'period' : response.attr('period') || self.voc.tWord('no_data'),
            'sex' : response.attr('sex') || self.voc.tWord('no_data'),
            'tariff' : response.attr('tariff') || self.voc.tWord('no_data'),
            'rate' : response.attr('rate') || self.voc.tWord('no_data'),
            'debt' : response.attr('debt') || self.voc.tWord('no_data'),
            'penaltyRate' : response.attr('penalty_rate') || self.voc.tWord('no_data'),
            'penaltyFee' : response.attr('penalty_fee') || self.voc.tWord('no_data'),
            'fee' : response.attr('fee') || self.voc.tWord('no_data'),
            'feeFixed' : response.attr('fee_fixed') || self.voc.tWord('no_data'),
            'penaltyFeeFixed' : response.attr('penalty_fee_fixed') || self.voc.tWord('no_data'),
            'skipPenaltyDays' : response.attr('skip_penalty_days') || self.voc.tWord('no_data'),
            'skipDays' : response.attr('skip_days') || self.voc.tWord('no_data'),
            'debt' : response.attr('debt') || self.voc.tWord('no_data'),
            'status' : response.attr('status'),
            'terrorist' : parseInt(response.attr('terrorist')),
            'execution_list_num' : response.attr('execution_list_num') || self.voc.tWord('no_data'),
            'reason_code' : response.attr('reason_code') || null,
            'reason_text' : response.attr('reason_text'),
            'operator_user_id' : response.attr('operator_user_id'),
            'inspector_user_id' : response.attr('inspector_user_id'),
            'comment' : response.attr('comment'),
            'point_id' : response.attr('point_id'),
            'point_uv_scanner' : response.attr('point_uv_scanner'),
            'available_amount' : response.attr('available_amount'),
            'client_id' : response.attr('client_id'),
            'id' : response.attr('id')
        };

        data['full_name'] = data['surname'] + ' ' + data['name'] + ' ' + data['middlename'];

        createdAt = Date.parse(response.attr('created_at'));

        if (createdAt) {
            createdAt = new Date(createdAt);
            data['created_at'] = createdAt.format(dateFormat.masks.russianDateTime);
            finishingAt = createdAt;
            finishingAt.setDate(finishingAt.getDate() + data['period']);
            data['finishing_at'] = finishingAt.format(dateFormat.masks.russianDateTime);
        } else {
            data['created_at'] = self.voc.tWord('no_data');
            data['finishing_at'] = self.voc.tWord('no_data');
        }

        if (response.attr('overpayment')) {
            data['overpayment'] = response.attr('overpayment') + ' ' + self.voc.tWord('rubles').toLowerCase();
        } else {
            data['overpayment'] = self.voc.tWord('no_data');
        }

        responseSteps = response
            .children('steps')
            .children();

        $.each(responseSteps, function(key, value) {
            stepName = $(value).attr('value');
            data[stepName] = T.Models.Step.parse(value);
        });

        if (data[T.Models.Step.PASSPORT_REG_STEP]) {
            data['address'] = data[T.Models.Step.PASSPORT_REG_STEP]['address'];
        } else {
            data['address'] = self.voc.tWord('no_data');
        }

        // UI
        data['status_word'] = self.statusesTranslates[data['status']];

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