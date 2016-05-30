/**
 * Dialog element
 */

T.UI.Dialog = function (el) {
    var self = this;
    var self = this;

    self._closeTimeOut = 30000;
    self._timeOutHandle = null;

    self._autoHide = true;

    T.UI.BasicElement.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        var autoHide = this.getElement().attr(T.Managers.ResourcesManager.AUTO_HIDE_DIALOG_ATTRIBUTE);

        self._autoHide = parseInt(autoHide) ? true : false;
    };

    self.init();
};

T.UI.Dialog.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Show dialog modal
 */
T.UI.Dialog.prototype.show = function () {
    this.getElement().modal({backdrop : false});
    this.playSoundAlert();

    if (self._autoHide) {
        this.setCloseTimeouts();
    }
};

/**
 * Close dialog modal
 */
T.UI.Dialog.prototype.close = function (callback) {
    this.getElement().modal('toggle');
};

/**
 * Return true if dialog is opened
 */
T.UI.Dialog.prototype.isOpened = function () {
    var dialog = this.getElement();

    if (dialog.hasClass('in')) {
        return true;
    } else {
        return false;
    }
};

/**
 * On close event
 * @param callback
 */
T.UI.Dialog.prototype.onCloseEvent = function (callback) {
    this.getElement().on('hidden.bs.modal', function () {
        if (callback) {
            callback();
        }
    })
};

/**
 * Setting time after which dialog will automatically closed
 */
T.UI.Dialog.prototype.setCloseTimeouts = function () {
    var self = this;

    self._openTimeout = setTimeout(function() {
        if (self.isOpened())
        {
            self.close();
        }
    }, self._closeTimeOut);
};

/**
 * Play sound
 */
T.UI.Dialog.prototype.playSoundAlert = function () {
    var id = this.getResourceId();

    switch (id) {
        case T.Managers.ResourcesManager.NEW_ORDER_DIALOG:
            T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.SOUND_TYPE, 'new_order_sound').play();
            break;
        case T.Managers.ResourcesManager.CONNECTION_LOST_DIALOG:
            T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.SOUND_TYPE, 'connection_lost_sound').play();
            break;
        default:
            break;
    }
};

/**
 * Bind click event to dialog's buttons
 * @param buttonSelector
 * @param callback
 */
T.UI.Dialog.prototype.buttonClick = function (classSelector, callback) {
    var button = this.getElement().find('.' + classSelector);

    button.click(function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * Insert image to view-photos dialog
 */
T.UI.Dialog.prototype.insertImage = function (imageRes) {
    if (this.getResourceId() != T.Managers.ResourcesManager.VIEW_PHOTOS_DIALOG_ID) {
        T.System.errorLog('T.UI.Dialog.insertImage: is not a view-photos dialog!');
        return;
    }

    var modalPhoto = this.find(T.Managers.ResourcesManager.MODAL_PHOTO_ID);

    modalPhoto.reset();
    modalPhoto.setSrc(imageRes.getSrc());
};

/**
 * Returns image inside view-photos dialog
 */
T.UI.Dialog.prototype.getModalPhoto = function () {
    if (this.getResourceId() != T.Managers.ResourcesManager.VIEW_PHOTOS_DIALOG_ID) {
        T.System.errorLog('T.UI.Dialog.getModalPhoto: is not a view-photos dialog!');
        return;
    }

    return this.find(T.Managers.ResourcesManager.MODAL_PHOTO_ID);
};

/**
 * Bind events on rotate buttons
 */
T.UI.Dialog.prototype.setRotateButtonsEvent = function () {
    var currentDialog = this;
    var rotateLeft = currentDialog.find(T.Managers.ResourcesManager.ROTATE_LEFT_BUTTON_ID);
    var rotateRight = currentDialog.find(T.Managers.ResourcesManager.ROTATE_RIGHT_BUTTON_ID);

    rotateLeft.click(function () {
        var modalPhoto = currentDialog.getModalPhoto();
        modalPhoto.rotate(-90);
    });

    rotateRight.click(function () {
        var modalPhoto = currentDialog.getModalPhoto();
        modalPhoto.rotate(90);
    });
};

/**
 * Set alert message
 * @param text
 */
T.UI.Dialog.prototype.setMessage = function (text) {
    var message = this.getElement().find('.' + T.Managers.ResourcesManager.ALERT_MESSAGE_CLASS);
    message.text(text);
};