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

        if (localStorage.getItem('performance_Expanded') === "true") {
            self.performanceCollapse.show();
        }

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

                let currencyGrouping = Map.groupBy(data.Records, (item) => `${item.CurrencyCode}`).entries().toArray();

                currencyGroup = currencyGrouping.map(cg => {
                    let items = Map.groupBy(cg[1], (item) => `${item.ReportGroup}`).entries().toArray();

                    return {
                        currencyCode: cg[0],
                        formattingCulture: cg[1][0].FormattingCulture,
                        Totallabel: `${cg[0]}: ${formatNumber(items.flatMap(i => i[1]).reduce((a, i) => a + i.TotalOutstanding, 0), 2, items[0].FormattingCulture)}`,
                        totals: Map.groupBy(items.flatMap(i => i[1]), item => item.PeriodLabel).entries().toArray().map(m => {
                            return {
                                PeriodLabel: m[0],
                                Total: m[1].reduce((accumulator, currentItem) => accumulator += currentItem.TotalOutstanding, 0),
                                FormattingCulture: m[1][0].FormattingCulture,
                                CurrencyCode: m[1][0].CurrencyCode
                            }
                        }),
                        items: items
                    };
                });

                self.records(currencyGroup);

                self.busy(false);
            })
    }

    self.revert = () => {
        self.reportGrouping(CREDIT_CONTROLLER);
        self.currencyOrSterling(CURRENCY);
    }

    //#endregion



    //#region Events

    self.performanceCollapsableElement.addEventListener('show.bs.collapse', (event) => {
        localStorage.setItem('performance_Expanded', "true");
    });

    self.performanceCollapsableElement.addEventListener('hide.bs.collapse', (event) => {
        localStorage.setItem('performance_Expanded', "false");
    });

    //#endregion


    return self;
};