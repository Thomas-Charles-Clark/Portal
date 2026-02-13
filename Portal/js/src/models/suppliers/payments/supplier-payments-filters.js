const supplierPaymentsFiltersViewModel = ({
    ready,
    busy,
    busyMessage,
    refreshParent
} = {
        ready: ko.observable(false),
        busy: ko.observable(false),
        busyMessage: ko.observable('Please Wait'),
        refreshParent: () => { }
    }) => {

    let self = {
        ready,
        busy,
        busyMessage,
        refreshParent
    };

    //#region Properties

    self.countDisplay = ko.observable(undefined);

    self.displayMode = ko.observable();

    self.sidebarElement = document.querySelector('#filters-sidebar');

    self.weekCommencingDate = ko.observable(moment(new Date()).weekdayWithStartWeekday(0, 1).toDate());

    self.paymentPeriodId = ko.observable(+moment(new Date()).weekdayWithStartWeekday(0, 1).format('YYYYMMDD'));

    self.paymentPeriod = ko.observable();

    self.onlyIncludeSuppliersWithPaymentRequests = ko.observable(true);

    self.onlyShowSuppliersWithOutstandingInvoices = ko.observable(false);

    self.userId = ko.observable(getUserId());

    self.user = ko.observable();

    self.refreshDashboard = null;

    self.paymentRequestStatus = ko.observable(localStorage.paymentRequestStatus ?? 'Outstanding');

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

    self.paymentPeriodParams = kendoMDCDropDownList({
        odata: true,
        endPoint: '/odata/PaymentPeriods',
        textField: 'Label',
        valueField: 'PeriodID',
        idObservable: self.paymentPeriodId,
        objObservable: self.paymentPeriod,
        originalValue: ko.unwrap(self.paymentPeriodId),
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        revertFunction: function () {
            let self = this;
            self.idObservable(self.originalValue);
            self.dropDownListSettings.widget().trigger('change');
        },
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'PeriodID'
        },
        select: function (e) {
            console.log('paymentPeriodParams select', e);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('payment-period-prefilter')
        }
    });

    self.userSelectorParams = kendoMDCDropDownList({
        odata: true,
        endPoint: '/odata/Members/Default.MembersForSupplierPaymentsFilterFunction(searchTerm=null)',
        textField: 'FullName',
        valueField: 'Id',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Members/Default.MemberValueMapper(id=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                    }
                });
            }
        },
        idObservable: self.userId,
        objObservable: self.user,
        height: 340,
        template: '#: FullName # - #: Email #',
        valueTemplate: '#: FullName # - #: Email #',
        optionLabel: {
            FullName: 'All Users',
            Email: 'All Users'
        },
        autoBind: true,
        height: 340,
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();

            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Email",
                        operator: "startswith",
                        value: filterValue
                    },
                    {
                        field: "FullName",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            });
        },
        showClear: false,
        clearFunction: null,
        permitRevert: true,
        enable: ko.observable(window.getCanUserAdministrate()),
        disable: ko.observable(!window.getCanUserAdministrate()),
        clearable: ko.observable(window.getCanUserAdministrate()),
        clearFunction: function (e) {
            self.userId('')
            self.userSelectorParams.dropDownListSettings.widget().value(-1);
        },
        revertible: ko.observable(true),
        popupSettings: {
            appendTo: document.querySelector('#user-selector')
        }
    });

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

    self.paymentRequestStatusParams = kendoMDCDropDownList({
        skipCascade: true,
        optionLabel: 'All Statuses',
        data: [{
            Label: 'Fully Approved',
            RequestStatus: 'Fully Approved',
            SortOrder: 1
        }, {
            Label: 'Partially Approved',
            RequestStatus: 'Partially Approved',
            SortOrder: 2
        }, {
            Label: 'Pending Approval',
            RequestStatus: 'Pending Approval',
            SortOrder: 3
        }, {
            Label: 'Outstanding',
            RequestStatus: 'Outstanding',
            SortOrder: 4
        }, {
            Label: 'Error',
            RequestStatus: 'Error',
            SortOrder: 5
        }],
        textField: 'Label',
        valueField: 'RequestStatus',
        idObservable: self.paymentRequestStatus,
        objObservable: ko.observable(),
        originalValue: ko.unwrap(self.paymentRequestStatus),
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        revertFunction: function () {
            let self = this;
            self.idObservable(self.originalValue);
            self.dropDownListSettings.widget().trigger('change');
        },
        clearFunction: function () {
            self.paymentRequestStatus('')
            self.paymentRequestStatusParams.dropDownListSettings.widget().value(-1);
            localStorage.removeItem('paymentRequestStatus');
        },
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'SortOrder'
        },
        select: function (e) {
            console.log('paymentRequestStatusParams select', e);
            localStorage.setItem('paymentRequestStatus', e.dataItem.Label);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('payment-request-status-prefilter')
        }
    });

    self.errorables = [

    ];

    //#endregion



    //#region Computeds

    self.approvalFilters = ko.computed(() => {
        let result = {
            outstandingRequests: self.onlyIncludeSuppliersWithPaymentRequests(),
            outstandingInvoices: self.onlyShowSuppliersWithOutstandingInvoices()
        };

        return result;
    }, self);

    self.requestFilters = ko.computed(() => {

        let result = {
            requestedByMemberId: self.userId(),
            paymentRequestStatus: self.paymentRequestStatus() == '' ? null : self.paymentRequestStatus()
        };

        console.log(`filters.requestFilters computed`, result);

        return result;
    }, self);

    self.basketFilters = ko.computed(() => {
        let result = {
            periodId: self.paymentPeriodId()
        }
        return result;
    }, self);

    //#endregion



    //#region Subscriptions

    self.paymentPeriodId.subscribe(nv => {
        self.refreshParent();
    });

    self.userId.subscribe(nv => {
        self.refreshParent();
    })

    self.paymentPeriod.subscribe(nv => {
        console.log('paymentsFilters paymentPeriod subscribe hit', nv);
        let approvalBtn = document.querySelector('#approvals-tab-btn');
        if (nv.Finalised) {
            approvalBtn.disable = true;
            approvalBtn.classList.add('disabled');
            document.querySelector('#payment-requests-tab-btn').click();
        } else {
            approvalBtn.disable = false;
            approvalBtn.classList.remove('disabled');
        }
    })

    //#endregion



    //#region Methods

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.toJS = () => {
        return {
            periodId: self.paymentPeriodId(),
            memberId: self.userId(),
            onlyShowSuppliersWithPaymentRequests: self.onlyIncludeSuppliersWithPaymentRequests(),
            onlyShowSuppliersWithOutstandingInvoices: self.onlyShowSuppliersWithOutstandingInvoices()
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};