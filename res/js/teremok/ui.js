/**
 * UI namespace
 */
T.UI = new function () {
    var self = this;

    /**
     * Alert message dialog
     * @param text
     */
    self.alert = function (text) {
        var template, messageDialog, body;
        template = T.Templates.getTemplate('alert-dialog');

        if (!template.length) {
            T.System.errorLog('Can\'t find alert dialog!');
            return;
        }

        template = $(template.html());
        messageDialog = new T.UI.Dialog(template);
        messageDialog.fill();
        body = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'body');
        body.append(messageDialog);
        messageDialog.setMessage(text);

        messageDialog.buttonClick('ok-button', function () {
            $('#alert').remove();
        });

        messageDialog.show();
    };

    self.confirm = function (data) {
        var template, confirmDialog, body;
        var text = data['text'];
        var yesCallback = data['yesCallback'];
        var noCallback = data['noCallback'];

        template = T.Templates.getTemplate('confirm-dialog');

        if (!template.length) {
            T.System.errorLog('Can\'t find alert dialog!');
            return;
        }

        template = $(template.html());
        confirmDialog = new T.UI.Dialog(template);
        confirmDialog.fill();
        body = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'body');
        body.append(confirmDialog);
        confirmDialog.setMessage(text);

        confirmDialog.buttonClick('yes-button', function () {
            if (yesCallback) {
                yesCallback();
            }

            confirmDialog.remove();
        });

        confirmDialog.buttonClick('no-button', function () {
            if (noCallback) {
                noCallback();
            }

            confirmDialog.remove();
        });

        confirmDialog.show();
    };

    /**
     * Show 'Loading' in overlay
     */
    self.showLoading = function () {
        $.isLoading({ text : 'Loading' });
    };

    /**
     * Hide loading overlay
     */
    self.hideLoading = function () {
        $.isLoading('hide');
    };
};