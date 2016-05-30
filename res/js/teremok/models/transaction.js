/**
 * Transaction model
 */

T.Models.Transaction = new function()
{
    var self = this;

    self.voc = null;

    /**
     * Transaction types
     */
    self.TYPE_LOAN                  = '0';
    self.TYPE_REJECT                = '1';
    self.TYPE_INTEREST              = '10';
    self.TYPE_PENALTY               = '11';
    self.TYPE_PRINCIPAL_REPAYMENT   = '20';
    self.TYPE_INTEREST_REPAYMENT    = '21';
    self.TYPE_PENALTY_REPAYMENT     = '22';
    self.TYPE_TERMINAL_OUT          = '30';
    self.TYPE_TERMINAL_IN           = '31';
    self.TYPE_REFUND                = '100';

    self.translations = {};
    /**
     * Initing transaction model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();

        self.translations[self.TYPE_LOAN]                   = self.voc.tWord('issue');
        self.translations[self.TYPE_INTEREST]               = self.voc.tWord('rate');
        self.translations[self.TYPE_PENALTY]                = self.voc.tWord('penalty'),
        self.translations[self.TYPE_PRINCIPAL_REPAYMENT]    = self.voc.tWord('redemption(body_of_the_load)');
        self.translations[self.TYPE_INTEREST_REPAYMENT]     = self.voc.tWord('redemption(rate)');
        self.translations[self.TYPE_PENALTY_REPAYMENT]      = self.voc.tWord('redemption(penalty)');
    };

    /**
     * Parse response's transaction element
     * @param response
     */
    self.parse = function (response) {
        var transaction;
        var response = $(response);

        transaction = {
            id : response.attr('id'),
            type : response.attr('type'),
            amount : response.attr('amount'),
            point_id : response.attr('point_id'),
            client_id : response.attr('client_id'),
            order_id : response.attr('order_id'),
            hash : response.attr('hash')
        };

        var date = new Date(response.attr('created_at'));

        if (date) {
            transaction['created_at'] = date;
        }

        return transaction;
    };
}
