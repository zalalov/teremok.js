/**
 * Release note model
 */
T.Models.ReleaseNote = new function () {
    var self = this;

    self.voc = null;

    /**
     * Initing release note model
     */
    self.init = function () {
        self.voc = T.Vocabularies.getVocabulary();
    };

    /**
     * Parse response's release note element
     * @param response
     */
    self.parse = function (response) {
        var response = $(response);
        var releaseNote, releaseDate;

        releaseNote = {};

        releaseDate = Date.parse(response.attr('date'));
        releaseNote['release_date'] = releaseDate ? new Date(releaseDate) : self.voc.tWord('no_data');

        if (releaseDate) {
            releaseNote['date'] = releaseNote['release_date'].format(dateFormat.masks.russianDate);
        } else {
            releaseNote['date'] = self.voc.tWord('no_data');
        }

        releaseNote['version'] = response.attr('version');
        releaseNote['changes'] = response.attr('changes');
        releaseNote['id'] = releaseNote['version'].replace(/\./g, '_');

        return releaseNote;
    };
};