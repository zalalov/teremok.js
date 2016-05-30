/**
 * Vocabularies namespace
 */
T.Vocabularies = new function () {
    var self = this;

    self._currentVocabulary = null;
    self._currentLanguage = null;

    self.langToVoc = {
        'en-US' : 'English',
        'ru-RU' : 'Russian'
    };

    /**
     * Initing localization
     * @type {*}
     */
    self.init = function () {
        var lang;

        if (!$.cookie('lang'))
        {
            lang = navigator.language || navigator.userLanguage;
            self.setLanguage(lang);
        }
        else
        {
            lang = $.cookie('lang');
            self._currentLanguage = lang;
            self._currentVocabulary = T.Vocabularies[self.langToVoc[self._currentLanguage]];
        }

    };

    /**
     * Returns current vocabulary
     */
    self.getVocabulary = function ()
    {
        return self._currentVocabulary;
    };

    /**
     * Returns current language
     */
    self.getLanguage = function ()
    {
        return self._currentLanguage;
    };

    /**
     * Setting current language
     */
    self.setLanguage = function (lang) {
        self._currentLanguage = lang;
        self._currentVocabulary = T.Vocabularies[self.langToVoc[self._currentLanguage]];
        $.cookie('lang', self._currentLanguage, { expires : 365 });

        T.System.log('T.Vocabularies : Selected new language: ', lang);
    };
};