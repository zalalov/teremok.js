/**
 * Validators namespace
 */
T.System.Validators = new function () {
    var self = this;

    self.PHONE_MASK_NAME    = 'phone';
    self.INT_MASK_NAME      = 'int';
    self.NUMBER_MASK_NAME   = 'number'

    /**
     * Check value by mask
     * @param mask
     * @param value
     */
    self.checkValue = function (mask, value) {
        switch (mask) {
            case self.PHONE_MASK_NAME:
                return self.isPhone(value);
            case self.NUMBER_MASK_NAME:
                return self.isNum(value);
            default:
                break;
        }

        return null;
    };

    /**
     * Check if is float
     * @param n
     * @returns {boolean}
     */
    self.isFloat = function (n) {
        return n === +n && n !== (n|0);
    };

    /**
     * Check if is integer
     * @param n
     * @returns {boolean}
     */
    self.isInteger = function (n) {
        return n === +n && n === (n|0);
    };

    /**
     * Check if number is int
     * @param number
     */
    self.isNum = function (number) {
        return !isNaN(number);
    };

    /**
     * Check if parameter is phone
     * @param phone
     */
    self.isPhone = function (phone) {
        if (phone.length != 10 || !self.isNum(phone))
            return false;

        return true;
    };

    /**
     * Check if parameter is SMS code
     */
    self.isSMSCode = function (code) {
        if (code.length != 5 || !self.isNum(code))
            return false;

        return true;
    }
};