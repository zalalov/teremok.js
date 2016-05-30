/**
 * Message model
 */

T.Models.Message = new function()
{
    var self = this;

    self.voc = null;

    /**
     * Initing message model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse response's message element
     * @param response
     */
    self.parse = function (response) {
        var message;
        var response = $(response);

        message = {};

        message['id'] = response.attr('id');
        message['created_at'] = new Date(response.attr('created_at')).format('dd.mm.yyyy HH:MM:ss');
        message['phone'] = response.attr('phone');
        message['text'] = response.attr('text');
        
        return message;
    };
};
