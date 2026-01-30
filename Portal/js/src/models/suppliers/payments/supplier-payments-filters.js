const supplierPaymentsFiltersViewModel = ({
    ready,
    busy,
    busyMessage
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait')
}) => {

    let self = {};

    //#region Properties

    self.ready = ready;

    self.busy = busy;

    self.busyMessage = busyMessage;

    self.countDisplay = ko.observable(undefined);

    self.displayMode = ko.observable();

    self.sidebarElement = document.querySelector('#filters-sidebar');

    self.weekCommencingDate = ko.observable(moment(new Date()).weekdayWithStartWeekday(0, 1).toDate());

    self.onlyIncludeSuppliersWithPaymentRequests = ko.observable(true);

    self.onlyShowSuppliersWithOutstandingInvoices = ko.observable(false);

    //#endregion



    //#region Components

    self.weekCommencingDateParams = {
        observable: self.weekCommencingDate,
        originalValue: self.weekCommencingDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy',
                dayViewHeaderFormat: { month: 'long', year: 'numeric' }
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'calendar',
                cellSize: '3rem'
            },
            restrictions: {
                daysOfWeekDisabled: [0, 2, 3, 4, 5, 6]
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: false,
            debug: false
        },
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        revertFunction: function () {
            let self = this;
            self.observable(self.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

    self.onlyIncludeSuppliersWithPaymentRequestsParams = {
        checkboxId: "only-with-requests",
        label: "Only Display Suppliers with Outstanding Payment Requests",
        observable: self.onlyIncludeSuppliersWithPaymentRequests,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy
    }

    self.onlyShowSuppliersWithOutstandingInvoicesParams = {
        checkboxId: "only-with-invoices",
        label: "Only Display Suppliers with Outstanding Invoices",
        observable: self.onlyShowSuppliersWithOutstandingInvoices,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy
    }

    self.errorables = [

    ];

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.toJS = () => {
        return {
            weekCommencing: moment(self.weekCommencingDate()).format('YYYY/MM/DD'),
            onlyShowSuppliersWithPaymentRequests: self.onlyIncludeSuppliersWithPaymentRequests(),
            onlyShowSuppliersWithOutstandingInvoices: self.onlyShowSuppliersWithOutstandingInvoices()
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};