const   DISPLAY_MODE_PAYMENT_REQUESTS = 1,
        DISPLAY_MODE_OVERDUE_INVOICES = 2;

const supplierPaymentApprovalsFiltersViewModel = ({
    params,
    parent
} = {
        params: {},
        parent: {}
    }) => {
    let self = {
        refreshParent: parent.refresh
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.countDisplay = ko.observable(undefined);

    self.displayMode = ko.observable();

    self.sidebarElement = document.querySelector('#filters-sidebar');

    self.weekCommencingDate = ko.observable(moment(new Date()).weekdayWithStartWeekday(0, 1).toDate());

    //#endregion



    //#region Components

    self.weekCommencingDateParams = {
        label: "Week Commencing",
        observable: self.weekCommencingDate,
        originalValue: self.weekCommencingDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
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
                viewMode: 'months',
                cellSize: '3rem'
            },
            restrictions: {
                daysOfTheWeekDisabled: [1, 2, 3, 4, 5, 6]
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: false,
            debug: false
        },
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

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

    //#endregion



    //#region Events



    //#endregion


    return self;
};