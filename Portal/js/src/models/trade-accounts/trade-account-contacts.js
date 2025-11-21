const tradeAccountContactsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait')

    self.tradeAccount = ko.observable();

    self.tradeAccountContacts = ko.observableArray([]);

    self.filters = tradeAccountContactsFiltersViewModel(typeof getContactFilterParams === 'function' ? getContactFilterParams() : undefined);

    self.dashboardPods = ko.observableArray([]);

    self.tradeAccounts = ko.observableArray([]);

    //#endregion


    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Methods

    self.tradeAccountSearch = (data) => {
        self.busy(true);
        
        console.log('tradeAccountSearch calling with', data);

        fetch('/api/TradeAccountContactsAPI/TradeAccountSearch', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('tradeAccountSearch calling with', data);
                self.busy(false);
                self.dashboardPods(data.DashboardPods.map(p => tradeAccountContactsDashboardPodViewModel({
                    rec: p
                })));
                self.tradeAccounts(data.Results.map(d => tradeAccountContactViewModel({
                    rec: d,
                })));
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.fetchContacts = (tradeAccountId) => {
        self.busy(true);
        let data = {
            tradeAccountId
        };
        console.log('FetchContacts calling with', data);
        fetch('/api/tradeaccountcontactsapi/FetchContacts', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                self.tradeAccountContacts(data.map(d => tradeAccountContactViewModel({
                    rec: d,
                })));
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
        }

    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions

    self.tradeAccount.subscribe(nv => {
        if (nv) {
            self.fetchContacts();
        }
    })

    self.filters.getData.subscribe(nv => {
        self.tradeAccountSearch(nv);
    })

    //#endregion



    //#region Events



    //#endregion


    return self;
};