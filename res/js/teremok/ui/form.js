/**
 * Form block
 * @param el
 * @constructor
 */
T.UI.Form = function (el) {
    var self = this;

    T.UI.Container.call(this, el);
};

T.UI.Form.prototype = Object.create(T.UI.Container.prototype);

/**
 * Get form's params
 */
T.UI.Form.prototype.getParams = function () {
    var form = this.getElement();
    var values = {};

    $.each(form.find('.' + T.Managers.ResourcesManager.FORM_PARAM_CLASS), function (key, param) {
        var paramName = $(param).attr(T.Managers.ResourcesManager.FORM_PARAM_NAME_ATTR);
        var paramType = $(param).attr('type');
        var value, paramRes;

        var overloadedValTypes = [
            T.Managers.ResourcesManager.RADIO_TYPE,
            T.Managers.ResourcesManager.MULTY_CHECKBOX_TYPE
        ];

        if ($.inArray($(param).attr(T.Managers.ResourcesManager.RESOURCE_TYPE_ATTRIBUTE), overloadedValTypes) != -1) {
            paramRes = T.Managers.ResourcesManager.getElementResource($(param));
            value = paramRes.val();
        } else {
            if (paramType == 'checkbox') {
                if ($(param).is(':checked')) {
                    value = 1;
                } else {
                    value = 0;
                }
            } else {
                value = $(param).val();
            }
        }


        values[paramName] = value;
    });

    return values;
};

/**
 * Validate form (add errors if field is not valid by mask)
 */
T.UI.Form.prototype.valid = function (element) {
    var validForm = true;
    var form = this.getElement();

    $.each(form.find('.' + T.Managers.ResourcesManager.FORM_PARAM_CLASS), function (key, param) {
        var mask, value, validField, paramRes;

        mask = $(param).attr(T.Managers.ResourcesManager.MASK_ATTRIBUTE);
        value = $(param).val();
        validField = true;
        paramRes = T.Managers.ResourcesManager.getElementResource($(param));
        paramRes.removeError();

        if (paramRes.hasClass(T.Managers.ResourcesManager.NOT_EMPTY_FIELD_CLASS) && paramRes.isEmpty()) {
            paramRes.addError();
            validForm = false;
        } else {
            if (mask) {
                validField = T.System.Validators.checkValue(mask, value);

                if (!validField) {
                    paramRes.addError();
                    validForm = false;
                }
            }
        }
    });

    return validForm;

};

/**
 * Reset filter's values
 */
T.UI.Form.prototype.reset = function () {
    var self = this;
    var filters = this.getElement().find('.' + T.Managers.ResourcesManager.FORM_PARAM_CLASS);
    var defaultValue;

    $.each(filters, function (key, value) {
        var res = self.find($(value).attr(T.Managers.ResourcesManager.RESOURCE_ID_ATTRIBUTE));
        res.setDefaultValue();
    });
};