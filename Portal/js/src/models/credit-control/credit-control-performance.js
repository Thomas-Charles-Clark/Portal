const   CURRENCY = 'Currency',
        STERLING = 'Sterling',
        CurrencyOrSterling = [{
            Name: 'Currency',
            Value: 'Currency'
        }, {
            Name: 'Sterling',
            Value: 'Sterling'
        }];


const   CREDIT_CONTROLLER = 'CreditController',
        MARKET = 'Market',
        ReportingGroups = [{
            Name: "Credit Controller",
            Value: CREDIT_CONTROLLER
        }, {
            Name: "Market",
            Value: MARKET
        }];

const creditControlPerformanceViewModel = ({ } = {}) => {
    let self = {

    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait...');

    self.records = ko.observableArray([]);

    self.selectedPod = ko.observable();

    self.tradeAccountCodeList = ko.observableArray([]);

    self.reportGrouping = ko.observable(CREDIT_CONTROLLER);

    self.currencyOrSterling = ko.observable(CURRENCY);

    self.periods = ko.observableArray([]);

    //#endregion




    //#region Components

    self.reportingGroupParams = kendoMDCDropDownList({
        label: 'Reporting Group',
        data: ReportingGroups,
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.reportGrouping,
        objObservable: ko.observableArray(),
        optionLabel: {
            Name: '',
            Value: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false),
        clearable: function () {
            let self = this;
            self.observable(undefined);
            self.dropDownListSettings.widget().value(-1);
            self.dropDownListSettings.widget().trigger('change');
        },
        revertible: ko.observable(false)
    });

    self.currencyOrSterlingParams = kendoMDCDropDownList({
        label: 'Currency or Sterling',
        data: CurrencyOrSterling,
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.currencyOrSterling,
        objObservable: ko.observableArray(),
        optionLabel: {
            Name: '',
            Value: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false),
        clearable: function () {
            let self = this;
            self.observable(undefined);
            self.dropDownListSettings.widget().value(-1);
            self.dropDownListSettings.widget().trigger('change');
        },
        revertible: ko.observable(false)
    });

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.tradeAccountCodeList.subscribe(nv => {
        self.fetch();
    });

    self.reportGrouping.subscribe(nv => {
        self.fetch();
    });

    self.currencyOrSterling.subscribe(nv => {
        self.fetch();
    });

    //#endregion


    //#region Methods

    self.fetch = () => {
        self.busy(true);

        let data = {
            reportGrouping: self.reportGrouping() == '' ? null : self.reportGrouping(),
            currencyOrSterling: self.currencyOrSterling() == '' ? null : self.currencyOrSterling(),
            tradeAccountCodeList: self.tradeAccountCodeList().split(',')
        };

        console.log('fetchPerformance calling with', data);

        fetch("/api/CreditControlAPI/FetchAgedSalesLedger", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchPerformance returned', data);

                self.periods(Map.groupBy(data.Records, (item) => item.PeriodLabel).entries().toArray().map(e => e[0])); // First stage of transposing the results...

                let map = Map.groupBy(data.Records, (item) => `${item.ReportGroup}: ${item.CurrencyCode}`).entries().toArray();

                self.records(map);

                self.busy(false);
            })
    }

    //#endregion



    //#region Events

    

    //#endregion


    return self;
};