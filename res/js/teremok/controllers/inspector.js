/**
 * Inspector controller
 */

T.Controllers.Inspector = new function () {
    var self = this;

    /**
     * Order data
     * @type {null}
     */
    self.currentOrderId = null;
    self.currentClientId = null;

    /**
     * Inspector pages identifiers
     * @type {string}
     */
    self.clientCard     = 'client-card';
    self.orderCard      = 'order-card';
    self.historyCard    = 'history-card';
    self.prevOrderCard  = 'previous-card';

    /**
     * Inspector page's templates
     */
    self.orderCardTemplate          = 'inspector-order-card';
    self.clientCardTemplate         = 'inspector-client-card';
    self.ordersHistoryCardTemplate  = 'inspector-orders-history';
    self.prevOrderCardTemplate      = 'inspector-prev-order-card';
    self.desktopTemplate            = 'inspector-desktop';

    /**
     * Vocabulary
     * @type {null}
     */
    self.voc = null;

    /**
     * Dialogs
     */
    self.newOrderDialog = null;

    self.ws = null;

    /**
     * Controller opening
     */
    self.open = function () {
        self.voc = T.Vocabularies.getVocabulary();
        self._mainContainer = 'inspector-container';

        self.connectProxy();
        self.openDesktopPage();

        self.newOrderDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'new_order_dialog');
        self.setInspectorInfo();
        self.initReleaseNotes();
    };

    /**
     * Setting inspector name, state
     */
    self.setInspectorInfo = function () {
        var inspectorName = T.System.User.surname + ' ' + T.System.User.name.charAt(0) + '.' + T.System.User.middlename.charAt(0) + '.';
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'inspector_name').setValue(inspectorName);
    };

    /**
     * Connecting to proxy server
     */
    self.connectProxy = function () {
        self.ws = new T.System.ProxyServer(self);
        self.ws.connect();
    };

    /**
     * New order event
     * @param response
     */
    self.newOrder = function (orderId) {
        self.currentOrderId = orderId;

        self.newOrderDialog.buttonClick('aggree-button', function () {
            self.assignOrder();
        });

        if (!self.newOrderDialog.isOpened()) {
            self.newOrderDialog.fillNewOrderDialogData(self.currentOrderId);
            self.newOrderDialog.show();
        }
    };

    /**
     * Assigning order
     */
    self.assignOrder = function () {
        var data = {
            order_id : self.currentOrderId,
            sid      : T.System.User.sid
        };

        T.System.Server.AJAX.command('inspector.assign',
            data,

            function (response) {
                var messageData, message, response;
                response = $(response);

                if (response.find('x').attr('status') != '200')
                {
                    if (response.find('x').attr('status') == self.INVALID_ORDER_STATUS)
                    {
                        T.UI.alert('Invalid order status');
                        return;
                    }

                    T.UI.alert(self.voc.tWord('order_receiving_error'));
                    self.newOrderDialog.close();
                    return;
                }

                messageData = {
                    cmd : T.System.User.role + '.accept',
                    order_id : self.currentOrderId,
                    opkey : T.System.User.sid
                };

                message = self.ws.buildMessage(messageData);
                self.ws.sendCommand(message);

                self.newOrderDialog.close();

                T.Managers.DataManager.parse(response);

                self.initOrderForm();
            },

            function(response) {
                T.UI.alert(self.voc.tWord('order_receiving_error'));
                self.newOrderDialog.close();
            }
        );
    };

    /**
     * Geting reject reasons
     */
    self.getRejectSeasons = function(callback)
    {
        T.System.Server.AJAX.command('inspector.get_reject_reasons',
            {
                'sid' : T.System.User.sid
            },

            function(response) {
                if ($(response).find('x').attr('status') != '200')
                {
                    T.UI.alert(self.voc.tWord('init_error'));
                    return;
                }

                if (callback) {
                    callback(response);
                }
            },

            function(response) {
                T.UI.alert(self.voc.tWord('init_error'));
            }
        );
    };

    /**
     * Open inspector-desktop page
     */
    self.openDesktopPage = function () {
        var mainContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_CONTAINER_TYPE, self._mainContainer);
        mainContainer.openPage(self.desktopTemplate);
        self.initDesktop();
        self.setInspectorInfo();
    };

    /**
     * Init Inspector's default desktop
     */
    self.initDesktop = function () {
        var connectButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'connect_button');
        var connectIndicator = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INDICATOR_TYPE, 'connection_indicator');

        if (self.ws.isConnected()) {
            connectIndicator.online();
        }

        connectButton.click(function () {
            self.connectProxy();
            connectButton.hide();
        });
    };

    /**
     * Filling order form
     * @param response
     */
    self.initOrderForm = function (orderId) {
        var order, client, mainContainer, headerContainer, orderContainer, photosContainer, footerContainer, card;

        mainContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_CONTAINER_TYPE, self._mainContainer);

        if (!orderId) {
            order = T.Managers.DataManager.getOrder(self.currentOrderId);
            card = self.orderCard;
            mainContainer.openPage(self.orderCardTemplate);

            self.getRejectSeasons(function (response) {
                var rejectDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'deny_dialog');
                rejectDialog.fillRejectReasons(response);
            });
        } else {
            order = T.Managers.DataManager.getOrder(orderId);
            card = self.prevOrderCard;
            mainContainer.openPage(self.prevOrderCardTemplate);
        }

        self.currentClientId = order['client_id'];
        client = T.Managers.DataManager.getClient(self.currentClientId);

        headerContainer = mainContainer.find('header_container');
        orderContainer = mainContainer.find('order_container');
        photosContainer = mainContainer.find('photos_container');
        footerContainer = mainContainer.find('footer_container');

        headerContainer.insertInspectorHeaderData(order, card);
        orderContainer.insertInspectorMainData(order, card);
        photosContainer.initPhotosContainer(order, card);
        footerContainer.initFooterContainer(card);
    };

    /**
     * Filling client form
     * @param response
     */
    self.initClientForm = function () {
        var client, mainContainer, headerContainer, orderContainer, photosContainer;
        client = T.Managers.DataManager.getClient(self.currentClientId);

        mainContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_CONTAINER_TYPE, self._mainContainer);

        mainContainer.openPage(self.clientCardTemplate);

        headerContainer = mainContainer.find('header_container');
        orderContainer = mainContainer.find('order_container');
        photosContainer = mainContainer.find('photos_container')

        headerContainer.insertInspectorHeaderData(client, self.clientCard);
        orderContainer.insertInspectorMainData(client, self.clientCard);

        photosContainer.initPhotosContainer(client, self.clientCard);
    };

    /**
     * Get client's orders history
     * @param offset
     */
    self.getOrdersHistory = function (offset, callback) {
        T.System.Server.AJAX.command('inspector.get_client_orders',
            {
                'sid' : T.System.User.sid,
                'offset' : offset
            },

            function(response) {
                if ($(response).find('x').attr('status') != '200')
                {
                    T.UI.alert(self.voc.tWord('init_error'));
                    return;
                }

                if (callback) {
                    callback(response);
                }
            },

            function(response) {
                T.UI.alert(self.voc.tWord('init_error'));
            }
        );
    };

    /**
     * Filling client form
     * @param response
     */
    self.initOrdersHistoryForm = function (response) {
        var client, order, orders, mainContainer, headerContainer, historyContainer;
        client = T.Managers.DataManager.getClient(self.currentClientId);
        order = T.Managers.DataManager.getOrder(self.currentOrderId);
        T.Managers.DataManager.parse(response);
        orders = T.Managers.DataManager.getClientOrders(self.currentClientId);

        mainContainer = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.MAIN_CONTAINER_TYPE, self._mainContainer);

        mainContainer.openPage(self.ordersHistoryCardTemplate);

        headerContainer = mainContainer.find('header_container');
        historyContainer = mainContainer.find('history_container');

        headerContainer.insertInspectorHeaderData(order, self.historyCard);
        historyContainer.insertOrdersHistoryData(orders);
    };

    self.rejectOrder = function (reasonCode, reasonText) {
        T.System.Server.AJAX.command('inspector.reject',
            {
                reason_text : reasonText,
                reason_code : reasonCode,
                sid : T.System.User.sid
            },

            function(response) {
                if (callback) {
                    callback(response);
                }
            },

            function(response) {
                T.UI.alert(self.voc.tWord('init_error'));
            }
        );
    };

    self.approveOrder = function (amount, period, callback) {
        T.System.Server.AJAX.command('inspector.approve',
            {
                amount : amount,
                period : period,
                sid : T.System.User.sid
            },

            function(response) {
                if (callback) {
                    callback(response);
                }
            },

            function(response) {
                T.UI.alert(self.voc.tWord('init_error'));
            }
        );
    };

    /**
     * Close current form & shows inspector desktop
     */
    self.closeForm = function () {
        self.openDesktopPage();
        self.startPinging();
    };

    /**
     * On socket connection error
     */
    self.proxyConnectionLost = function () {
        var connectionLostDialog;

        self.closeForm();
        self.stopPinging();
        connectionLostDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'connection_lost_dialog');
        connectionLostDialog.show();
        T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'connect_button').show();
    };

    /**
     * Stop send ping command
     */
    self.startPinging = function () {
        if (self.ws) {
            self.ws.startPinging();
        }
    };

    /**
     * Stop send ping command
     */
    self.stopPinging = function () {
        if (self.ws) {
            self.ws.stopPinging();
        }
    };

    /**
     * Load release notes list
     * @param data
     * @param successCallback
     */
    self.loadReleaseNotes = function (data, successCallback) {
        T.System.Server.AJAX.command(
            T.System.User.role + '.release_notes',
            data,
            successCallback,
            function (response) {}
        );
    };

    /**
     * Init release notes list
     */
    self.initReleaseNotes = function () {
        var params = {
            offset : 0
        };

        var listData = {
            params : params,
            type : T.Managers.ListManager.RELEASE_NOTES_LIST,
            loadMethod : self.loadReleaseNotes
        };

        self.loadReleaseNotes(params, function (response) {
            T.Managers.DataManager.parse(response);
            T.Managers.ListManager.fillList(listData);
        });
    };
};

/**
 * Inserting inspector's headers (inspector)
 * @param data
 * @param card
 */
T.UI.Container.prototype.insertInspectorHeaderData = function (data, card) {
    var voc = T.Vocabularies.getVocabulary();

    this.find('inspector_name').setValue(T.System.User.FIO).show();

    switch (card) {
        case T.Controllers.Inspector.prevOrderCard:
            this.find('order_id').setValue(data['id']).show();
            this.find('order_date').setValue(data['created_at']).show();
            this.find('point_info').setValue(voc.tWord('terminal') + ' #' + data['point_id']).show();
            break;
        case T.Controllers.Inspector.orderCard:
            this.find('order_id').setValue(data['id']).show();
            this.find('order_date').setValue(data['created_at']).show();
            this.find('point_info').setValue(voc.tWord('terminal') + ' #' + data['point_id']).show();
            this.find('point_balance').setValue(data['available_amount'] + ' ' + voc.tWord('rubles').toLowerCase()).show();
            this.find('orders_history').click(function () {
                T.System.Router.getController().getOrdersHistory(0, function (response) {
                    T.System.Router.getController().initOrdersHistoryForm(response);
                });
            });
            break;
        case T.Controllers.Inspector.clientCard:
            break;
    }
};

/**
 * Insert inspector's main window data (inspector)
 * @param data
 * @param card
 */
T.UI.Container.prototype.insertInspectorMainData = function (data, card) {
    var voc = T.Vocabularies.getVocabulary();
    var date, birthday, age;
    var order;

    switch (card) {
        case T.Controllers.Inspector.prevOrderCard:
            order = T.Managers.DataManager.getOrder(data['id']);

            T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'back_to_order_card').click(function () {
                T.System.Router.getController().initOrderForm();
            });
            break;
        case T.Controllers.Inspector.orderCard:
            this.find('client_card').click(function () {
                T.System.Router.getController().initClientForm();
            });
            order = T.Managers.DataManager.getOrder(T.System.Router.getController().currentOrderId);
            break;
        case T.Controllers.Inspector.clientCard:
            order = T.Managers.DataManager.getOrder(T.System.Router.getController().currentOrderId);
            break;
        default:
            break;
    }

    this.find('amount').setValue(order['amount'] + ' ' + voc.tWord('rubles').toLowerCase()).show();
    this.find('duration').setValue(order['period'] + ' ' + voc.tWord('genitive_days').toLowerCase()).show();
    this.find('rate').setValue(order['rate'] + ' %').show();

    if (card == T.Controllers.Inspector.orderCard) {
        this.find('client_card').click(function () {
            T.System.Router.getController().initClientForm();
        });
    } else {
        if (card == T.Controllers.Inspector.clientCard) {
            T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'back_to_order_card').click(function () {
                T.System.Router.getController().initOrderForm();
            });
        }
    }

    this.find('name').setValue(data['full_name']).show();

    date = new Date().getTime();
    birthday = new Date(data['birthday']).getTime();

    date = new Date(date - birthday);
    age = Math.abs(date.getUTCFullYear() - 1970);

    date = Date.parse(birthday);
    date = date ? new Date(date).format(dateFormat.masks.russianDate + ', ' + age) : voc.tWord('no_data');

    this.find('birthday').setValue(date).show();

    if (data[T.Models.Step.INN_STEP]) {
        this.find('inn').setValue(data[T.Models.Step.INN_STEP]['inn']).show();
    }

    if (data[T.Models.Step.PASSPORT_PHOTO_STEP]) {
        this.find('passport_number').setValue(data[T.Models.Step.PASSPORT_PHOTO_STEP]['number']).show();
        this.find('passport_department').setValue(data[T.Models.Step.PASSPORT_PHOTO_STEP]['department']).show();
        this.find('passport_issue_place').setValue(data[T.Models.Step.PASSPORT_PHOTO_STEP]['issue_place']).show();
        this.find('passport_issue_date').setValue(data[T.Models.Step.PASSPORT_PHOTO_STEP]['issue_date']).show();
        this.find('city').setValue(data[T.Models.Step.PASSPORT_PHOTO_STEP]['birthplace']).show();
    }

    if (data[T.Models.Step.PASSPORT_REG_STEP]) {
        this.find('passport_reg_country').setValue(data[T.Models.Step.PASSPORT_REG_STEP]['country']).show();
        this.find('passport_reg_city').setValue(data[T.Models.Step.PASSPORT_REG_STEP]['city']).show();
        this.find('passport_reg_address').setValue(data[T.Models.Step.PASSPORT_REG_STEP]['address']).show();
        this.find('passport_reg_date').setValue(data[T.Models.Step.PASSPORT_REG_STEP]['reg_date']).show();
        this.find('passport_reg_department').setValue(data[T.Models.Step.PASSPORT_REG_STEP]['reg_department']).show();
    }

    if (data[T.Models.Step.JOB_STEP]) {
        this.find('job_company').setValue(data[T.Models.Step.JOB_STEP]['company']).show();
        this.find('job_position').setValue(data[T.Models.Step.JOB_STEP]['position']).show();
        this.find('job_phone').setValue(data[T.Models.Step.JOB_STEP]['phone']).show();
        this.find('job_address').setValue(data[T.Models.Step.JOB_STEP]['address']).show();
    }

    if (data[T.Models.Step.GUARANTOR_STEP]) {
        this.find('guarantor_name').setValue(data[T.Models.Step.GUARANTOR_STEP]['name']).show();
        this.find('guarantor_phone').setValue(data[T.Models.Step.GUARANTOR_STEP]['phone']).show();
    }

    if (data[T.Models.Step.FIXED_PHONE_STEP]) {
        this.find('fixed_phone').setValue(data[T.Models.Step.FIXED_PHONE_STEP]['phone']).show();
    }

    if (data[T.Models.Step.ACTUAL_ADDRESS_STEP]) {
        this.find('actual_address').setValue(data[T.Models.Step.ACTUAL_ADDRESS_STEP]['address']).show();
    }
};

/**
 * Fill client's orders history (inspector)
 * @param orders
 */
T.UI.Container.prototype.insertOrdersHistoryData = function (orders) {
    var template = T.Templates.getTemplate('orders-history-row');
    var orderElement, date;
    var voc = T.Vocabularies.getVocabulary();
    var fio;

    $.each(orders, function (key, value) {
        if (!fio) {
            fio = T.Managers.DataManager.getClient(value['client_id'])['full_name'];
        }

        orderElement = $(template).clone();

        $.each(orderElement.find('.resource'), function (resKey, resElement) {
            $(resElement).attr('resource_id', $(resElement).attr('resource_id') + '_' + value['id']);

            date = Date.parse(value['created_at']);
            !isNaN(date) ? date = new Date(value['created_at']).format(dateFormat.masks.russianDate) : date = voc.tWord('no_data');

            $(resElement)
                .find('[resource_id=order_date]')
                .find('.value')
                .text(date);
            $(resElement)
                .find('[resource_id=order_id]')
                .find('.value')
                .text('#' + value['id']);

            $(resElement)
                .find('[resource_id=order_amount_period]')
                .find('.value').text(
                    value['amount'] + ' '
                        + voc.tWord('rubles').toLowerCase()
                        + ' (' + value['period']
                        + ' ' + voc.tWord('genitive_days') + ')'
                );
            $(resElement)
                .find('[resource_id=point_id]')
                .find('.value')
                .text(voc.tWord('terminal') + ' #' + value['point_id']);
            var statusColor;

            if ($.inArray(parseInt(value['status']), T.Models.Order.successStatuses) != -1) {
                statusColor = 'green';
            } else {
                statusColor = 'red';
            }

            $(resElement)
                .find('[resource_id=state]')
                .find('.value')
                .addClass(statusColor)
                .text(T.Models.Order.statusesTranslates[value['status']]);
            $(resElement)
                .find('[resource_id=comment]')
                .find('.value')
                .text(value['comment']);
        });

        orderElement = $(orderElement.html());
        orderElement.attr('order_id', value['id']);
        $('[resource_id=orders_list_container]').append(orderElement);

        orderElement.click(function () {
            T.System.Router.getController().initOrderForm($(this).attr('order_id'), T.Controllers.Inspector.prevOrderCard);
        });

        T.Managers.ResourcesManager.parse(orderElement);
    });

    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.INFORMATION_TYPE, 'client_name').setText(fio);
    T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'back_button').click(function () {
        var controller = T.System.Router.getController();
        controller.initOrderForm();
    });

    var info = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.CONTAINER_TYPE, 'history_container').findByType('information');
    info.show();
};

/**
 * Init photos (inspector)
 * @param data
 * @param card
 */
T.UI.Container.prototype.initPhotosContainer = function (data, card) {
    var mainImage = this.find('main_image');
    var photo = this.find('photo');
    var passportPhoto = this.find('passport_photo');
    var passportReg = this.find('passport_reg');
    var signature = this.find('signature');
    var fingerprint = this.find('fingerprint');
    var passportIr = this.find('passport_ir');
    var passportPhotoUv = this.find('passport_photo_uv');
    var passportRegUv = this.find('passport_reg_uv');
    var secondDocument = this.find('second_document');
    var info = {};

    var cameraImage = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.IMAGE_TYPE, 'camera_image');
    var modalPhoto = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.IMAGE_TYPE, 'modal_photo');
    var cameraButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'camera_button');
    var modalPhotoButton = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'modal_photo_button');

    var rotateLeft = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'rotate_left');
    var rotateRight = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.BUTTON_TYPE, 'rotate_right');

    var cameraPhotoDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'camera_photo_dialog');

    var previewCollection = new T.UI.ResourcesList();

    switch (card) {
        case T.Controllers.Inspector.orderCard:
            info['order'] = data['id'];
            cameraButton.click(function () {
                cameraImage.setSrc(cameraImage.getCameraPhotoUrl());
                cameraImage.startCameraPhotoUpdate();
            });
            break;
        case T.Controllers.Inspector.prevOrderCard:
            info['order'] = data['id'];
            break;
        case T.Controllers.Inspector.clientCard:
            info['client'] = data['id'];
            break;
    }

    mainImage.getContainer().setSizes();
    mainImage.draggable();
    modalPhoto.draggable();

    info['step'] = 'photo';
    info['type'] = 'visible';
    photo.showImage(photo.buildSrc(info));
    mainImage.showImage(mainImage.buildSrc(info));
    modalPhoto.showImage(mainImage.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_PHOTO_STEP;
    passportPhoto.showImage(passportPhoto.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_REG_STEP;
    passportReg.showImage(passportReg.buildSrc(info));
    info['step'] = T.Models.Step.SIGNATURE_STEP;
    signature.showImage(signature.buildSrc(info));
    info['step'] = T.Models.Step.FINGERPRINT_STEP;
    fingerprint.showImage(fingerprint.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_FIRST_STEP;
    passportIr.showImage(passportIr.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_REG_STEP;
    secondDocument.showImage(secondDocument.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_PHOTO_STEP;
    info['type'] = 'uv';
    passportPhotoUv.showImage(passportPhotoUv.buildSrc(info));
    info['step'] = T.Models.Step.PASSPORT_REG_STEP;
    info['type'] = 'uv';
    passportRegUv.showImage(passportRegUv.buildSrc(info));

    previewCollection.add(photo);
    previewCollection.add(passportPhoto);
    previewCollection.add(passportReg);
    previewCollection.add(signature);
    previewCollection.add(fingerprint);
    previewCollection.add(passportIr);
    previewCollection.add(passportPhotoUv);
    previewCollection.add(passportRegUv);
    previewCollection.add(secondDocument);

    previewCollection.click(function (preview) {
        preview.click(function () {
            var mainImage = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.IMAGE_TYPE, 'main_image');
            mainImage.reset();
            mainImage.showImage(preview.getSrc());
            modalPhoto.reset();
            modalPhoto.showImage(preview.getSrc());
        });
    });

    cameraPhotoDialog.onCloseEvent(function () {
        cameraImage.stopCameraPhotoUpdate();
    });

    rotateLeft.click(function () {
        modalPhoto.rotate(-90);
    });
    rotateRight.click(function () {
        modalPhoto.rotate(90);
    });
};

/**
 * Fill footer block (inspector)
 * @param card
 */
T.UI.Container.prototype.initFooterContainer = function (card) {

    switch (card) {
        case T.Controllers.Inspector.clientCard:
            break;
        case T.Controllers.Inspector.orderCard:
            var denyDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'deny_dialog');
            var partlySatisfyDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'partly_satisfy_dialog');
            var satisfyDialog = T.Managers.ResourcesManager.get(T.Managers.ResourcesManager.DIALOG_TYPE, 'satisfy_dialog');

            var controller = T.System.Router.getController();

            denyDialog.buttonClick('reject-button', function () {
                var reasonsContainer = denyDialog.find('reject-reasons-container');
                var reasonCode, reasonText;
                reasonCode = reasonsContainer.getElement().find('input[type=radio]:checked').val();

                if (reasonCode != -1) {
                    reasonText = '';
                } else {
                    reasonText = reasonsContainer.getElement().find('textarea').val();
                }

                controller.rejectOrder(reasonCode, reasonText);

                denyDialog.onCloseEvent(function () {
                    controller.closeForm();
                });
                denyDialog.close();
            });

            partlySatisfyDialog.buttonClick('partly-satisfy-button', function () {
                var amount = partlySatisfyDialog.find('partly_amount').val();
                var period = partlySatisfyDialog.find('partly_period').val();

                amount = parseInt(amount);
                period = parseInt(period);

                if (!isNaN(amount) && !isNaN(period)) {
                    T.System.Router.getController().approveOrder(amount, period);
                }

                partlySatisfyDialog.onCloseEvent(function () {
                    controller.closeForm();
                });

                partlySatisfyDialog.close();
            });

            satisfyDialog.buttonClick('satisfy-button', function () {
                var order = T.Managers.DataManager.getOrder(controller.currentOrderId);

                controller.approveOrder(order['amount'], order['period']);

                satisfyDialog.onCloseEvent(function () {
                    controller.closeForm();
                });

                satisfyDialog.close();
            });
            break;
        case T.Controllers.Inspector.prevOrderCard:
            break;
    }
};

/**
 * Filling reject reasons
 * @param response
 */
T.UI.Dialog.prototype.fillRejectReasons = function (response) {
    var reasons = $(response).find('reason');
    var reasonTemplate = T.Templates.getTemplate('reject-reason');
    var reasonsContainer = this.find('reject-reasons-container').getElement();
    var attribute, template;
    var voc = T.Vocabularies.getVocabulary();

    template = reasonTemplate.clone();

    attribute = 'pr' + '-1';
    template
        .find('input')
        .attr('id', attribute)
        .attr('value', '-1')
    template
        .find('label')
        .attr('for', attribute)
        .text(voc.tWord('specify_another_reason'));

    reasonsContainer.prepend(template.html());

    reasons.each(function (key, reason) {
        template = reasonTemplate.clone();

        attribute = 'pr' + $(reason).attr('value');
        template
            .find('input')
            .attr('id', attribute)
            .attr('value', $(reason).attr('value'))
        template
            .find('label')
            .attr('for', attribute)
            .text($(reason).attr('text'));

        reasonsContainer.prepend(template.html());
    });
};

/**
 * Insert new order dialog data
 * @param id
 */
T.UI.Dialog.prototype.fillNewOrderDialogData = function (id) {
    var date = new Date();
    date = date.format(dateFormat.masks.default);

    this.find('new_order_dialog_order_id').setText(id);
    this.find('new_order_dialog_order_date').setText(date);
};

/**
 * Start showing camera photo by timeout
 */
T.UI.Image.prototype.startCameraPhotoUpdate = function () {
    var self = this;
    self.cameraTimeout = setTimeout(function () {
        self.showImage(self.getCameraPhotoUrl());
    }, 5000);
};

/**
 * Start showing camera photo by timeout
 */
T.UI.Image.prototype.stopCameraPhotoUpdate = function () {
    if (this.cameraTimeout) {
        clearTimeout(this.cameraTimeout);
    }
};