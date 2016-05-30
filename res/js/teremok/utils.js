/**
 * Utils namespace
 */
T.Utils = new function () {
    var self = this;

    /**
     * Reduction date from "DD, DD, DD" to "DD-DD"
     * if it's possible
     */
    self.dateReduction = function(date)
    {
        var days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        var daysArr = date.split(', ');

        if (daysArr.length)
        {
            var newDate = [];
            var tmp = [];

            $.each(daysArr, function(key, value) {
                daysArr[key] = days.indexOf(value);
            });

            daysArr = daysArr.sort();

            for (var i = 1; i < daysArr.length; i++)
            {
                if (!tmp.length)
                {
                    if (daysArr[i] - daysArr[i - 1] == 1)
                    {
                        tmp.push(days[daysArr[i - 1]],days[daysArr[i]]);
                    }
                    else
                    {
                        newDate.push(days[daysArr[i - 1]]);

                        if (i == daysArr.length - 1)
                        {
                            newDate.push(days[daysArr[i]]);
                        }
                    }
                }
                else
                {
                    if (daysArr[i] - daysArr[i - 1] == 1)
                    {
                        tmp.push(days[daysArr[i]]);
                    }
                    else
                    {
                        if (tmp.length > 2)
                            newDate.push(tmp[0] + '-' + tmp[tmp.length - 1]);
                        else
                            newDate = newDate.concat(tmp);

                        tmp = [];
                    }

                    if ((i == daysArr.length - 1) && $.inArray(days[daysArr[i]], tmp) == -1)
                    {
                        newDate.push(days[daysArr[i]]);
                    }
                }
            }

            if (tmp.length > 2)
            {
                newDate.push(tmp[0] + '-' + tmp[tmp.length - 1]);
            }
            else
            {
                newDate = newDate.concat(tmp);
            }

            return newDate.join(', ');
        }
        else
        {
            return date;
        }
    };

    /**
     * Sets logo of interface
     */
    self.setLogo = function()
    {
        var role = T.System.User.role;
        var cmd = 'users.get_logo';
        var controller = T.System.Router.getController();
        var logo = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.IMAGE_TYPE, T.Managers.ResourcesManager.LOGO_IMAGE_ID);

        if (logo) {
            switch (role) {
                case T.Models.Role.GOD_ROLE:
                    if (controller.companyId != null) {

                        logo.setSrc(T.System.Config.GATEWAY_URL + '?cmd=' + cmd
                            + '&user_id=' + controller.companyId
                            + '&role=' + role
                            + '&sid=' + T.System.User.sid + '&_=' + new Date().getTime().toString());
                    }
                    break;
                case T.Models.Role.INSPECTOR_ROLE:
                    logo.setSrc(T.System.Config.GATEWAY_URL + '?cmd=' + cmd
                        + '&role=' + role
                        + '&sid=' + T.System.User.sid + '&_=' + new Date().getTime().toString());
                    break;
                case T.Models.Role.AGENT_ROLE:
                case T.Models.Role.ADMIN_ROLE:
                case T.Models.Role.ACCOUNTANT_ROLE:
                case T.Models.Role.COLLECTOR_ROLE:
                case T.Models.Role.LAWYER_ROLE:
                case T.Models.Role.TECH_ROLE:
                    logo.setSrc(T.System.Config.GATEWAY_URL + '?cmd=' + cmd
                        + '&role=' + role
                        + '&sid=' + T.System.User.sid + '&_=' + new Date().getTime().toString());
                    break;
                case T.Models.Role.OPERATOR_ROLE:
                case T.Models.Role.SUPPORT_ROLE:
                default:
                    break;
            }
        }
    };

    /**
     * Check fullHD vision
     * @returns {boolean}
     */
    self.fullHD = function() {
        return (screen.width >= 1920 && screen.height >= 1080);
    };

    /**
     * Translates html view
     * @param response
     * @param voc
     * @returns {$|*|jQuery|HTMLElement}
     */
    self.translateHtml = function(response, voc)
    {
        var t_response = $(response);

        $.each($(t_response).find('.t_word'), function(key, value) {
            var translation;

            if (voc.tWord($(value).html())) {
                translation = voc.tWord($(value).html());

                if ($(value).hasClass('lower_case')) {
                    $(value).replaceWith(translation.toLowerCase());
                } else {
                    $(value).replaceWith(translation);
                }
            }
            else
                T.System.errorLog("can't translate : " + $(value).html());
        });

        $.each($(t_response).find('.t_word_in_option'), function(key, value) {
            if (voc.tWord($(value).html()))
                $(value).html(voc.tWord($(value).html()));
            else
                T.System.errorLog("can't translate : " + $(value).html());
        });

        $.each($(t_response).find('.t_holder'), function(key, value) {
            if (voc.tWord($(value).attr('placeholder')))
                $(value).attr('placeholder', voc.tWord($(value).attr('placeholder')));
            else
                T.System.errorLog("can't translate : " + $(value).attr('placeholder'));
        });

        $.each($(t_response).find('.t_title'), function(key, value) {
            if (voc.tWord($(value).attr('title')))
                $(value).attr('title', voc.tWord($(value).attr('title')));
            else
                T.System.errorLog("can't translate : " + $(value).attr('title'));
        });

        $.each($(t_response).find('.tr_value'), function(key, value) {
            if (voc.tWord($(value).attr('value')))
                $(value).attr('value', voc.tWord($(value).attr('value')));
            else
                T.System.errorLog("can't translate : " + $(value).attr('value'));
        });

        return t_response;
    };

    /**
     * Checks if the block fields are valid
     * @param block
     * @returns {boolean}
     */
    self.validFields = function(block)
    {
        return block.find('.important_field').not('.success').length == 0;
    };

    //Converts date to UNIX timestamp
    self.date2timestamp = function(dateString)
    {
        var date = new Date(dateString);
        return date.getTime();
    };

    //Converts UNIX timestamp to date
    self.timestamp2date = function(timeStamp, scale)
    {
        var date = new Date(timeStamp * 1000);
        if (arguments[1] == "month")
            date = date.format("yyyy-mm");
        else
            date = date.format("yyyy-mm-dd");
        return date;
    };

    /**
     * Returns declare of num
     * @param number
     * @param titles
     * @returns {*}
     */
    self.declOfNum = function(number, titles)
    {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number % 100 > 4 && number % 100 < 20)? 2 : cases[ (number % 10 < 5) ? number % 10 : 5] ];
    };

    /**
     * Returns percentage ( a from b, b - 100%)
     */
    self.percentage = function (a, b) {
        if (!a || !b) {
            T.System.errorLog('T.Utils.percentage: Params invalid');
            return;
        }

        if (!T.System.Validators.isNum(a) || !T.System.Validators.isNum(b)) {
            T.System.errorLog('T.Utils.percentage: Enter valid values');
            return;
        }

        return Math.floor((a / b) * 100);
    };

    /**
     * Get year's first day
     */
    self.yearFirstDay = function () {
        var date = new Date();

        date.setDate(1);
        date.setMonth(0);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        return date;
    };

    /**
     * Get object's length
     * @param obj
     */
    self.objLength = function (obj) {
        return Object.keys(obj).length;
    };

    /**
     * Get 'CamelCase'
     * @param string
     */
    self.toCamelCaseClass = function (string) {
        var result = string;

        result = result.toLowerCase().replace(/(?:^|\s|[-_])\w/g, function(match) {
            return match.toUpperCase();
        });
        result = result.replace(/(\s|[-_])/g, function (match) {
            return '';
        });

        return result;
    };

    /**
     * Returns array with values by object's property
     */
    self.getPropValues = function (obj, prop) {
        var result = [];

        $.each(obj, function (key, value) {
            result.push(value[prop]);
        });

        return result;
    };

    /**
     * Diff between two dates in months
     * @param d1
     * @param d2
     * @returns {number}
     */
    self.monthDiff = function (d1, d2) {
        if (!d1 || !d2) {
            T.System.errorLog('T.Utils.monthDiff: Params invalid');
            return null;
        }

        if (d1 > d2) {
            var tmp = d1;
            d1 = d2;
            d2 = tmp;
        }

        return d2.getMonth() - d1.getMonth() + (12 * (d2.getFullYear() - d1.getFullYear()));
    };

    /**
     * Diff between two dates in days
     * @param d1
     * @param d2
     * @returns {*}
     */
    self.daysDiff = function (d1, d2) {
        if (!d1 || !d2) {
            T.System.errorLog('T.Utils.daysDiff: Params invalid');
            return null;
        }

        var diff =  Math.floor((d2.getTime() - d1.getTime()) / 86400000);

        return diff;
    };

    /**
     * Returns last array element
     * @param arr
     * @returns {*}
     */
    self.getLastArrayElement = function (arr) {
        if (arr instanceof Array) {
            return arr.slice(-1).pop();
        } else {
            T.System.errorLog('T.Utils.getLastArrayElement: Param is not an Array');
            return null;
        }
    };

    self.getLastObjectElement = function (obj) {
        if (obj instanceof Obejct) {
            return obj[Object.keys(obj)[Object.keys(obj).length - 1]];
        } else {
            T.System.errorLog('T.Utils.getLastObjectElement: Param is not an Object');
            return null;
        }
    };

    /**
     * Digits filter method for field
     * Allow backspace, tab, delete, arrows,
     * numbers and keypad numbers ONLY
     * home, end, period, and numpad decimal
     * @returns {*|each|each}
     * @constructor
     */
    jQuery.fn.digitsOnly = function()
    {
        return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                return (
                    key == 8 ||
                        key == 9 ||
                        key == 46 ||
                        key == 110 ||
                        key == 190 ||
                        (key >= 35 && key <= 40) ||
                        (key >= 48 && key <= 57) ||
                        (key >= 96 && key <= 105));
            });
        });
    };
};