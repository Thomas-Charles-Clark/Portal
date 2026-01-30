const supplierPaymentsDashboardViewModel = ({
    ready,
    busy,
    busyMessage,
    filters
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait'),
    filters: {}
}) => {

    let self = {};

    //#region Properties

    self.ready = ready;

    self.busy = busy;

    self.busyMessage = busyMessage;

    self.filters = filters;

    self.records = ko.observableArray(window.getDashboard());

    //#endregion



    //#region Components



    //#endregion



    //#region Computeds

    self.rows = ko.computed(() => {
        return self.records().filter(r => r.IsTotal == false).sort((a, b) => {
            return a.CurrencyCode > b.CurrencyCode ? 1 : -1;
        });
    }, self);

    self.totalRow = ko.computed(() => {
        return self.records().find(r => r.IsTotal == true);
    }, self);

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.refresh = () => {

        self.busy(true);

        let data = self.filters.toJS();

        console.log('dashboard.refresh calling with', data)

        fetch('/api/SupplierPayments/DashboardSelect', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        }).then(window.handleFetchResponse)
            .then(data => {
                console.log('dashboard.refresh returned', data)

                self.records(data.Records);

                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    //#endregion



    //#region Events



    //#endregion

    return self;
}