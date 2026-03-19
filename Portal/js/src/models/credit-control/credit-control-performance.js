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

    self.rowGrouping = ko.observableArray([]);

    self.records = ko.observableArray([]);

    self.selectedPod = ko.observable();

    self.tradeAccountCodeList = ko.observableArray([]);

    self.reportGrouping = ko.observable(localStorage.getItem('performance_reportGrouping') ?? CREDIT_CONTROLLER);

    self.currencyOrSterling = ko.observable(localStorage.getItem('performance_currencyOrSterling') ?? STERLING);

    self.periods = ko.observableArray([]);

    self.performanceCollapsableElement = document.querySelector('#performance-collapse');

    self.performanceCollapse = bootstrap.Collapse.getOrCreateInstance(self.performanceCollapsableElement, {
        toggle: false
    });

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
        clearable: ko.observable(false),
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
        clearable: ko.observable(false),
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
        localStorage.setItem('performance_reportGrouping', nv.toString());
        self.fetch();
    });

    self.currencyOrSterling.subscribe(nv => {
        localStorage.setItem('performance_currencyOrSterling', nv.toString());
        self.fetch();
    });

    //#endregion


    //#region Methods

    self.fetch = () => {

        if (self.tradeAccountCodeList().length > 0) {

            self.busy(true)

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

                    self.periods(Map.groupBy(data.Records, (item) => JSON.stringify({
                        columnLabel: item.ColumnLabel,
                        columnIndex: item.ColumnSortOrder
                    })).keys().toArray().map(k => JSON.parse(k))); // First stage of transposing the results...

                    let rowGrouping = Map.groupBy(data.Records, (item) => JSON.stringify({
                        rowLabel: item.RowLabel,
                        rowIndex: item.RowSortOrder,
                        isTotalRow: item.IsTotalRow
                    })).entries().toArray().map(k => JSON.parse(k[0]))

                    self.rowGrouping(rowGrouping);

                    self.records(data.Records);

                    self.busy(false);
                })
        }
    }

    self.performanceCellLookup = (rowIndex, columnIndex) => {
        //console.log('performanceCellLookup called with', [rowIndex, columnIndex]);

        let result = self.records().find(r => {
            return r.RowSortOrder == rowIndex && r.ColumnSortOrder == columnIndex
        });

        //console.log('performanceCellLookup returning', result);

        return result;
    }

    self.revert = () => {
        self.reportGrouping(CREDIT_CONTROLLER);
        self.currencyOrSterling(CURRENCY);
    }

    self.init = () => {
        if (localStorage.getItem('performance_Expanded') === "true") {
            self.performanceCollapse.show();
        }
    }

    //#endregion



    //#region Events

    self.performanceCollapsableElement.addEventListener('show.bs.collapse', (event) => {
        localStorage.setItem('performance_Expanded', "true");
        self.fetch();
    });

    self.performanceCollapsableElement.addEventListener('hide.bs.collapse', (event) => {
        localStorage.setItem('performance_Expanded', "false");
    });

    //#endregion


    return self;
};