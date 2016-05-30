/**
 * Date elements
 * @param el
 * @constructor
 */
T.UI.Date = function (el) {
    var self = this;

    self.DEFAULT_TODAY      = 'today';
    self.DEFAULT_YEAR_BEGIN = 'year_begin';
    self.DEFAULT_WEEK_AGO   = 'week_ago';
    self.DEFAULT_MONTH_AGO  = 'month_ago';
    self.DEFAULT_EMPTY      = 'empty';

    self.DATE_TYPE          = 'date';
    self.TIME_TYPE          = 'time';
    self.MONTH_TYPE         = 'month';

    self.MIN_ATTRIBUTE      = 'min';
    self.MAX_ATTRIBUTE      = 'max';

    T.UI.Input.call(this, el);

    /**
     * Set default value
     */
    self.setDefaultValue = function () {
        var defaultValue = this.getDefaultValue();

        switch (defaultValue) {
            case self.DEFAULT_TODAY:
                this.today();
                break;
            case self.DEFAULT_YEAR_BEGIN:
                this.yearBegin();
                break;
            case self.DEFAULT_WEEK_AGO:
                this.weekAgo();
                break;
            case self.DEFAULT_MONTH_AGO:
                this.monthAgo();
                break;
            case self.DEFAULT_EMPTY:
            default:
                break;
        }
    };

    self.setDefaultValue();
};

T.UI.Date.prototype = Object.create(T.UI.Input.prototype);

/**
 * Set today date
 */
T.UI.Date.prototype.today = function () {
    var today = new Date();
    var dateElement = this.getElement();
    var type = this.getType();

    switch (type) {
        case this.DATE_TYPE:
            today = today.format(dateFormat.masks.isoDate);
            break;
        case this.MONTH_TYPE:
            today = today.format(dateFormat.masks.isoDateMonth);
            break;
        default:
            T.System.errorLog('T.UI.Date.today: There\'s no type: ' + this.type);
            today = today.format(dateFormat.masks.isoDate);
            break;
    }

    dateElement.val(today);
};

/**
 * Set year begin date
 */
T.UI.Date.prototype.yearBegin = function () {
    var yearBegin = new Date(new Date().getFullYear(), 0, 1);
    var dateElement = this.getElement();
    var type = this.getType();

    switch (type) {
        case this.DATE_TYPE:
            yearBegin = yearBegin.format(dateFormat.masks.isoDate);
            break;
        case this.MONTH_TYPE:
            yearBegin = yearBegin.format(dateFormat.masks.isoDateMonth);
            break;
        default:
            T.System.errorLog('T.UI.Date.today: There\'s no type: ' + this.type);
            yearBegin = yearBegin.format(dateFormat.masks.isoDate);
            break;
    }

    dateElement.val(yearBegin);
};

/**
 * Set date week ago
 */
T.UI.Date.prototype.weekAgo = function () {
    var weekAgo = new Date();
    var dateElement = this.getElement();
    var type = this.getType();

    weekAgo.setDate(weekAgo.getDate() - 7);

    switch (type) {
        case this.DATE_TYPE:
            weekAgo = weekAgo.format(dateFormat.masks.isoDate);
            break;
        case this.MONTH_TYPE:
            weekAgo = weekAgo.format(dateFormat.masks.isoDateMonth);
            break;
        default:
            T.System.errorLog('T.UI.Date.today: There\'s no type: ' + this.type);
            weekAgo = weekAgo.format(dateFormat.masks.isoDate);
            break;
    }

    dateElement.val(weekAgo);
};

/**
 * Set date month ago
 */
T.UI.Date.prototype.monthAgo = function () {
    var monthAgo = new Date();
    var dateElement = this.getElement();
    var type = this.getType();

    monthAgo.setMonth(monthAgo.getMonth() - 1);

    switch (type) {
        case this.DATE_TYPE:
            monthAgo = monthAgo.format(dateFormat.masks.isoDate);
            break;
        case this.MONTH_TYPE:
            monthAgo = monthAgo.format(dateFormat.masks.isoDateMonth);
            break;
        default:
            T.System.errorLog('T.UI.Date.today: There\'s no type: ' + this.type);
            monthAgo = monthAgo.format(dateFormat.masks.isoDate);
            break;
    }

    dateElement.val(monthAgo);
};

T.UI.Date.prototype.setMin = function (value) {
    if (isNaN(Date.parse(value))) {
        T.System.errorLog('T.UI.Date.setMin: Params invalid');
        return;
    }

    this.getElement().attr(this.MIN_ATTRIBUTE, value);
};

T.UI.Date.prototype.setMax = function (value) {
    if (isNaN(Date.parse(value))) {
        T.System.errorLog('T.UI.Date.setMin: Params invalid');
        return;
    }

    this.getElement().attr(this.MAX_ATTRIBUTE, value);
};