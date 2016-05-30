/**
 * Basic image element
 * @param id
 * @constructor
 */
T.UI.Image = function (el) {
    var self = this;

    self.cameraTimeout = null;

    self.UI_TYPE = 'uv';
    self.VISIBLE_TYPE = 'visible';

    T.UI.BasicElement.call(this, el);

    /**
     * Init
     */
    self.init = function () {
        if (this.hasClass(T.Managers.ResourcesManager.BUILD_REQUIRED_CLASS)) {
            var src = this.buildSrc();
            this.showImage(src);
        }

        if (this.getResourceId() == T.Managers.ResourcesManager.MODAL_PHOTO_ID) {
            var viewPhotosDialog = T.Managers.ResourcesManager.getViewPhotosDialog();

            viewPhotosDialog.setRotateButtonsEvent();
            this.draggable();
        }
    };

    self.init();
};

/**
 * Inheritance from BasicElement
 * @type {prototype|*}
 */
T.UI.Image.prototype = Object.create(T.UI.BasicElement.prototype);

/**
 * Set image as draggable
 */
T.UI.Image.prototype.draggable = function () {
    this.getElement().draggable();
};

/**
 * When image will loaded
 */
T.UI.Image.prototype.load = function (callback) {
    this.getElement().load(function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * If image will not loaded
 */
T.UI.Image.prototype.error = function (callback) {
    this.getElement().error(function () {
        if (callback) {
            callback();
        }
    });
};

/**
 * Get image source
 */
T.UI.Image.prototype.getSrc = function () {
    return this.getElement().attr('src');
};

/**
 * Showing image by setting source
 */
T.UI.Image.prototype.showImage = function (src) {
    var container = this.getContainer();

    container.getPreloader().show();
    this.load(function () {
        container.getPreloader().hide();
    });
    this.error(function () {
        container.hide();
    });

    this.setSrc(src);
};

/**
 * Setting source to the image
 */
T.UI.Image.prototype.setSrc = function (src) {
    this.getElement().attr('src', src);
};

/**
 * Building source string by 'data' parameters
 */
T.UI.Image.prototype.buildSrc = function (data) {
    var src;

    if (data) {
        src = this.getFileUrl(data);
    } else {
        var data = this.buildImageParams();
        src = this.getFileUrl(data);
    }

    return src;
};

/**
 * Build request params from attributes
 */
T.UI.Image.prototype.buildImageParams = function () {
    var imageElement = this.getElement();

    var data = {};
    var step = imageElement.attr('step');
    var type = imageElement.attr('type');

    switch (imageElement.attr('datatype')) {
        case 'client':
            data['client'] = imageElement.attr('item_id');
            break;
        case 'order':
            data['order'] = imageElement.attr('item_id');
            break;
    }

    if (!step) {
        T.System.errorLog('T.UI.Image.buildSrc: Step attr invalid');
    }

    data['step'] = imageElement.attr('step');

    if (type) {
        data['type'] = imageElement.attr('type');
    } else {
        data['type'] = '';
    }

    return data;
};

/**
 * Get image source
 */
T.UI.Image.prototype.getFileUrl = function (data) {
    var cmd;

    if (data['client']) {
        cmd = T.System.User.role + '.get_client_file';
    } else {
        cmd = T.System.User.role + '.get_file';
    }

    var url = T.System.Config.GATEWAY_URL + '?'
        + 'cmd=' + cmd
        + '&step=' + data['step']
        + '&type=' + data['type']
        + '&sid=' + T.System.User.sid
        + '&_=' + new Date().getTime();

    if (data['order'])
    {
        url += '&order_id=' + data['order'];
    }

    if (data['client']) {
        url += '&client_id=' + data['client'];
    }

    return url;
};

/**
 * Get camera photo
 */
T.UI.Image.prototype.getCameraPhotoUrl = function (data) {
    var cmd;

    cmd = T.System.User.role + '.get_camera_photo';

    var url = '/gateway.php?'
        + 'cmd=' + cmd
        + '&sid=' + T.System.User.sid;

    return url;
};

/**
 * Rotate draggable image to the angle
 */
T.UI.Image.prototype.rotate = function (angle) {
    var image = this.getElement();
    var currentAngle = image.data('angle');
    var newAngle = parseInt(currentAngle) + parseInt(angle);
    image.data('angle', newAngle);

    image
        .css({
            '-moz-transform': 'rotate(' + newAngle + 'deg)',
            '-webkit-transform': 'rotate(' + newAngle + 'deg)',
            'transform': 'rotate(' + newAngle + 'deg)'
        });
};

/**
 * Reset image's rotate & scale values
 */
T.UI.Image.prototype.reset = function () {
    this.getElement()
        .data('angle', 0)
        .css({
            'left' : 0,
            'top' : 0,
            '-moz-transform': 'rotate('+0+'deg) scale('+1+')',
            '-webkit-transform': 'rotate('+0+'deg) scale('+1+')',
            'transform': 'rotate('+0+'deg) scale('+1+')'
        });
};