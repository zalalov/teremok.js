/**
 * Teremok's history singleton
 */
T.System.History = new function () {
    var self = this;

    self._actions = [];
    self._historyQueue = [];

    // Hash parts
    self.CONTROLLER_HASH_PART   = 'controller';
    self.PAGE_HASH_PART         = 'page';
    self.ITEM_HASH_PART         = 'item';

    self.hashParts = {
        0 : self.CONTROLLER_HASH_PART,
        1 : self.PAGE_HASH_PART,
        2 : self.ITEM_HASH_PART
    };

    // Page id for pushing new state
    self._page = 0;

    //Page id for current page
    self._currentPage = null;

    /**
     * Init
     */
    self.init = function () {
        window.onpopstate = function(event) {
            var leaveFullInfoPage = false;
            var page = event.state.page;
            var prevPageType, pageContainer;

            // Detect if popstate triggered by "back" event
            if (self._currentPage > page) {
                prevPageType = self._historyQueue[self._currentPage]['type'];

                if (prevPageType == T.Managers.ResourcesManager.FULL_INFO_PAGE_TYPE) {
                    leaveFullInfoPage = true;
                }
            }

            self._currentPage = page;
            self._page = page + 1;

            if (leaveFullInfoPage) {
                pageContainer = T.Managers.ResourcesManager.getPageContainer();
                pageContainer.leaveFullInfoPage();
            } else {
                self.parseURI(location.href);

                T.System.Router.open('index');
            }

            T.System.log("T.System.Router: Location: " + location.href + ", state: " + JSON.stringify(event.state));
        };
    };

    /**
     * Parse URI
     * @param uri
     */
    self.parseURI = function (uri) {
        var parser, hash, path;
        parser = $('<a>').prop('href', uri)[0];

        path = {
            protocol    : parser.protocol,
            hostname    : parser.hostname,
            port        : parser.port,
            pathname    : parser.pathname,
            search      : parser.search,
            hash        : parser.hash,
            host        : parser.host
        };

        hash = path['hash'].replace('#', '').split('/');

        self.setActions(hash);
    };

    /**
     * Parse hash to actions
     * @param hash
     */
    self.setActions = function (hash) {
        self._actions = [];

        $.each(hash, function (key, part) {
            self._actions[self.hashParts[key]] = part;
        });
    };

    /**
     * Get actions
     */
    self.getActions = function () {
        return self._actions;
    };

    /**
     * Set new state
     * @param stateData
     */
    self.newState = function (stateData) {
        var stateName = stateData['stateName'];
        var stateType = stateData['stateType'];
        var address = '/v2/#';

        if (T.System.User.loginned()) {
            address += T.System.User.role + '/' + stateName;
        } else {
            address += stateName;
        }

        window.history.pushState(
            {
                page : self._page
            },
            stateName,
            address
        );

        self.pushInQueue({
            name : stateName,
            address : address,
            type : stateType
        });
    };

    /**
     * Push new state in states queue
     * @param name
     * @param type
     */
    self.pushInQueue = function (stateData) {
        var name = stateData['name'];
        var type = stateData['type'];
        var address = stateData['address'];

        if (!name || !type || !address) {
            T.System.errorLog('T.System.History.pushInQueue: Params invalid');
            return;
        }

        if (self._historyQueue[self._page]) {
            self._historyQueue = self._historyQueue.slice(0, self._page);
        }

        self._historyQueue[self._page] = {
            name : name,
            address : address,
            type : type
        };

        self._currentPage = self._page;

        self._page++;
    };

    /**
     * Detect if popstate event was triggered by "back" or "forward"
     */
    self.isBackEvent = function () {
        if (self._currentPage > self._page) {
            return 1;
        } else {
            return 0;
        }
    };
};